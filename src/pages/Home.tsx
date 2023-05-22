import React, { useEffect, useState } from "react";
import { Project, UserProfile } from "../types/types";
import {
  createProject,
  getAuthedUserProfile,
  getProjects,
  joinExistingProject,
  updateAuthedUserName,
} from "../common/supabase";
import { PropertyList } from "../components/propertyList/PropertyList";
import { HomeContent, MySpacer, PageHeader } from "../components/styled/layout";
import { Header1, MyCard, SecondaryButton } from "../components/styled/styled";
import { AccountSettingsMenu } from "../components/accountSettingsMenu/AccountSettingsMenu";
import styled from "@emotion/styled";
import { MyTheme } from "../components/styled/theme";
import { showErrorMessage } from "../common/notifications";
import { ResponsiveDrawer } from "../components/styled/Drawer";
import CreateNewProject from "../forms/project/CreateNewProject";
import { PlusOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import JoinExistingProject from "../forms/project/JoinExistingProject";
import { MessageInstance } from "antd/es/message/interface";
import { PropertiesStoreProvider } from "../common/stores/propertiesStore";

interface HomeProps {
  signOut: () => void;
  messageApi: MessageInstance;
}

function Home({ signOut, messageApi }: HomeProps) {
  // Simple drawers where user can create new project or joing existing project.
  const [openCreateNewProject, setOpenCreateNewProject] = useState(false);
  const [openJoinExistingProject, setOpenJoinExistingProject] = useState(false);

  /// Authed user profile
  const [authedUserProfile, setAuthedUserProfile] = useState<UserProfile>();
  // All projects in which user is a member.
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  // Active project id
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    const getInitialData = async () => {
      try {
        const { data: userProfile, error: userProfileError } =
          await getAuthedUserProfile();

        const { data: projects, error: projectsError } = await getProjects();

        if (userProfileError || projectsError) {
          console.error(userProfileError);
          console.error(projectsError);
          throw new Error("Problem initialising data");
        }
        setAuthedUserProfile(userProfile!);
        setUserProjects(projects!);
      } catch (e: any) {
        messageApi.error("Problem initialising data");
        console.error(e.toString());
      }
    };
    getInitialData();
  }, [messageApi]);

  const updateUsername = async (newUsername: string) => {
    const { data, error } = await updateAuthedUserName(newUsername);
    if (error || !data) {
      showErrorMessage({
        messageApi: messageApi,
      });
    } else {
      setAuthedUserProfile({ ...authedUserProfile, ...data });
    }
  };

  const handleCreateNewProject = async (name: string, password: string) => {
    const { data, error } = await createProject(name, password);
    if (error || !data) {
      showErrorMessage({
        messageApi: messageApi,
      });
    } else {
      setUserProjects([data!, ...userProjects]);
      setActiveProject(data!);
      setOpenCreateNewProject(false);
      messageApi.success(`Created and switched to project ${data.name}`);
    }
  };

  const handleJoinExistingProject = async (name: string, password: string) => {
    const { data, error } = await joinExistingProject(name, password);
    if (error || !data) {
      showErrorMessage({
        messageApi: messageApi,
        content: error?.message,
      });
    } else {
      setUserProjects([data!, ...userProjects]);
      setActiveProject(data!);
      setOpenJoinExistingProject(false);
      messageApi.success(`Joined and switched to project ${data.name}`);
    }
  };

  return (
    <HomeContent>
      <PageHeader>
        <Header1>Property Evalu8r</Header1>

        {authedUserProfile && (
          <AccountSettingsMenu
            signOut={signOut}
            userProfile={authedUserProfile}
            updateUsername={updateUsername}
            activeProject={activeProject}
            setActiveProject={setActiveProject}
            projects={userProjects}
            openCreateNewProject={() => setOpenCreateNewProject(true)}
            openJoinExistingproject={() => setOpenJoinExistingProject(true)}
          />
        )}
      </PageHeader>

      {authedUserProfile && (
        <PropertiesStoreProvider
          messageApi={messageApi}
          authedUserProfile={authedUserProfile}
        >
          {!activeProject ? (
            <MyCard
              style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div>
                {userProjects.length > 0 && <div>Select a project</div>}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  {userProjects.map((p) => (
                    <ProjectSelectButton
                      key={p.id}
                      onClick={() => setActiveProject(p)}
                    >
                      {p.name}
                    </ProjectSelectButton>
                  ))}
                </div>
              </div>
              <MySpacer height={12} />
              <SecondaryButton
                size="sm"
                onClick={() => setOpenCreateNewProject(true)}
              >
                <PlusOutlined
                  style={{ fontSize: "16px", color: MyTheme.colors.secondary }}
                />
                <MySpacer width={8} />
                <div>
                  {userProjects.length
                    ? "Create a new project"
                    : "Create your first project"}
                </div>
              </SecondaryButton>
              <MySpacer height={12} />
              <SecondaryButton
                size="sm"
                onClick={() => setOpenJoinExistingProject(true)}
              >
                <UsergroupAddOutlined
                  style={{ fontSize: "16px", color: MyTheme.colors.secondary }}
                />
                <MySpacer width={8} />
                <div>Join existing project</div>
              </SecondaryButton>
              <MySpacer height={12} />
            </MyCard>
          ) : (
            <PropertyList
              key={activeProject.id}
              activeProject={activeProject}
              authedUserProfile={authedUserProfile!}
              messageApi={messageApi}
            />
          )}

          <ResponsiveDrawer
            closable={true}
            maskClosable={true}
            onClose={() => setOpenCreateNewProject(false)}
            open={openCreateNewProject}
            drawerKey="Note"
          >
            <CreateNewProject createNewProject={handleCreateNewProject} />
          </ResponsiveDrawer>

          <ResponsiveDrawer
            closable={true}
            maskClosable={true}
            onClose={() => setOpenJoinExistingProject(false)}
            open={openJoinExistingProject}
            drawerKey="Note"
          >
            <JoinExistingProject
              joinExistingProject={handleJoinExistingProject}
            />
          </ResponsiveDrawer>
        </PropertiesStoreProvider>
      )}
    </HomeContent>
  );
}

const ProjectSelectButton = styled.button`
  display: flex;
  padding: 10px 20px;
  align-items: center;
  border-radius: 8px;
  border: 3px solid ${MyTheme.colors.secondary};
  color: ${MyTheme.colors.secondary};
  font-size: 1.2em;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  transition: all 350ms ease;
  margin: 10px;
  flex-direction: row;
  justify-content: space-evenly;
  :hover {
    cursor: pointer;
    border-color: ${MyTheme.colors.linkText};
    color: ${MyTheme.colors.linkText};
  }
`;

export default Home;
