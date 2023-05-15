import React, { useEffect, useState } from "react";
import { Project, UserProfile } from "../types/types";
import {
  createProject,
  getAuthedUserProfile,
  getProjects,
  updateAuthedUserName,
} from "../common/supabase";
import { PropertyList } from "../components/propertyList/PropertyList";
import { HomeContent, MySpacer, PageHeader } from "../components/styled/layout";
import { Header1, MyCard, SecondaryButton } from "../components/styled/styled";
import { message } from "antd";
import { AccountSettingsMenu } from "../components/accountSettingsMenu/AccountSettingsMenu";
import styled from "@emotion/styled";
import { MyTheme } from "../components/styled/theme";
import { showErrorMessage } from "../common/notifications";
import { ResponsiveDrawer } from "../components/styled/drawer";
import CreateNewProject from "../forms/CreateNewProject";

function Home({
  signOut,
  authedUserId,
}: {
  signOut: () => void;
  authedUserId: string;
}) {
  // Ant Design message hook.
  const [messageApi, contextHolder] = message.useMessage();

  // Simple modal where user can create new project.
  const [openCreateNewProject, setOpenCreateNewProject] = useState(false);

  /// Authed user profile
  const [userProfile, setUserProfile] = useState<UserProfile>();
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
          console.log(userProfileError);
          console.log(projectsError);
          throw new Error("Problem initialising data");
        }
        setUserProfile(userProfile!);
        setUserProjects(projects!);
      } catch (e: any) {
        messageApi.error("Problem initialising data");
        console.log(e.toString());
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
      setUserProfile({ ...userProfile, ...data });
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
      messageApi.success(`Created and switched to new project ${data.name}`);
    }
  };

  return (
    <HomeContent>
      {contextHolder}
      <PageHeader>
        <Header1>Property Evalu8r</Header1>

        {userProfile && (
          <AccountSettingsMenu
            signOut={signOut}
            userProfile={userProfile}
            updateUsername={updateUsername}
            activeProject={activeProject}
            setActiveProject={setActiveProject}
            projects={userProjects}
            openCreateNewProject={() => setOpenCreateNewProject(true)}
          />
        )}
      </PageHeader>

      {!activeProject ? (
        <MyCard>
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
          <SecondaryButton onClick={() => setOpenCreateNewProject(true)}>
            {userProjects.length
              ? "Create a new project"
              : "Create your first project"}
          </SecondaryButton>
          <MySpacer height={12} />
        </MyCard>
      ) : (
        <PropertyList
          key={activeProject.id}
          activeProject={activeProject}
          authedUserId={authedUserId}
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
  :hover {
    cursor: pointer;
    border-color: ${MyTheme.colors.linkText};
    color: ${MyTheme.colors.linkText};
  }
`;

export default Home;
