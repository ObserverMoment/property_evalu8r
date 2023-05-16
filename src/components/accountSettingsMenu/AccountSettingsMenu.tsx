import { Divider, Dropdown, Input } from "antd";
import { IconButton } from "../styled/styled";
import { ReactSVG } from "react-svg";
import styled from "@emotion/styled";
import { MyTheme } from "../styled/theme";
import { Project, UserProfile } from "../../types/types";
import {
  PlusOutlined,
  CheckOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { FlexRow, MySpacer } from "../styled/layout";
import { useState } from "react";

interface AccountSettingsMenuProps {
  signOut: () => void;
  userProfile: UserProfile;
  updateUsername: (s: string) => void;
  projects: Project[];
  activeProject: Project | null;
  setActiveProject: (project: Project) => void;
  openCreateNewProject: () => void;
  openJoinExistingproject: () => void;
}

/// menu top right of the screen for settings and project switching etc.
export const AccountSettingsMenu = ({
  signOut,
  userProfile,
  updateUsername,
  projects,
  activeProject,
  setActiveProject,
  openCreateNewProject,
  openJoinExistingproject,
}: AccountSettingsMenuProps) => {
  const [enableUpdateUsername, setEnableUpdateUsername] = useState(false);

  const handleSaveNewUsername = (newUsername: string) => {
    updateUsername(newUsername);
    setEnableUpdateUsername(false);
  };

  const handleOpenCreateNewProject = () => {
    openCreateNewProject();
  };

  return (
    <Dropdown
      menu={{}}
      placement="bottomRight"
      dropdownRender={() => (
        <DropdownMenuContainer>
          {enableUpdateUsername ? (
            <UpdateUsername
              saveNewUsername={handleSaveNewUsername}
              cancel={() => setEnableUpdateUsername(false)}
            />
          ) : (
            <div>
              <div>Hello {userProfile.username}!</div>
              <ChangeUsernameButton
                style={{ fontSize: "0.8em" }}
                onClick={() => setEnableUpdateUsername(true)}
              >
                Change username
              </ChangeUsernameButton>
            </div>
          )}

          <Divider />
          <SwitchProjects
            projects={projects}
            activeProject={activeProject}
            setActiveProject={setActiveProject}
            openCreateNewProject={handleOpenCreateNewProject}
            openJoinExistingproject={openJoinExistingproject}
          />
          <Divider />
          <button onClick={signOut}>Sign Out</button>
        </DropdownMenuContainer>
      )}
      trigger={["click"]}
    >
      <IconButton>
        <div style={{ width: "24px" }}>
          <ReactSVG
            src="logo.svg"
            style={{ position: "relative", top: "1px" }}
          />
        </div>
      </IconButton>
    </Dropdown>
  );
};

interface UpdateUsernameProps {
  saveNewUsername: (s: string) => void;
  cancel: () => void;
}

const UpdateUsername = ({ saveNewUsername, cancel }: UpdateUsernameProps) => {
  const [newUsername, setNewUsername] = useState("");
  return (
    <div>
      <div style={{ fontSize: "0.8em" }}>Choose a new username.</div>
      <MySpacer height={12} />
      <Input
        placeholder="At least 4 characters"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
      />
      <MySpacer height={12} />
      <FlexRow style={{ padding: "0 6px" }}>
        <ChangeUsernameButton onClick={cancel}>Cancel</ChangeUsernameButton>
        <MySpacer width={12} />
        {newUsername.length > 3 && (
          <ChangeUsernameButton
            disabled={newUsername.length < 4}
            onClick={() => saveNewUsername(newUsername)}
          >
            Save
          </ChangeUsernameButton>
        )}
      </FlexRow>
    </div>
  );
};

interface SwitchProjectsProps {
  projects: Project[];
  activeProject: Project | null;
  setActiveProject: (p: Project) => void;
  openCreateNewProject: () => void;
  openJoinExistingproject: () => void;
}

const SwitchProjects = ({
  projects,
  activeProject,
  setActiveProject,
  openCreateNewProject,
  openJoinExistingproject,
}: SwitchProjectsProps) => (
  <div>
    <span style={{ color: MyTheme.colors.secondary, fontSize: "0.8em" }}>
      Switch project
    </span>

    <MySpacer height={8} />
    {projects.map((p) => (
      <div key={p.id}>
        {activeProject?.id === p.id ? (
          <ActiveProjectDisplay style={{ color: MyTheme.colors.linkText }}>
            <span>{p.name}</span>
            <div style={{ paddingLeft: "6px" }}>
              <CheckOutlined />
            </div>
          </ActiveProjectDisplay>
        ) : (
          <SwitchProjectButton onClick={() => setActiveProject(p)}>
            <span>{p.name}</span>
            <div style={{ paddingLeft: "6px" }}>
              <CheckOutlined style={{ opacity: 0 }} />
            </div>
          </SwitchProjectButton>
        )}
      </div>
    ))}
    <MySpacer height={8} />
    <CreateProjectButton onClick={openCreateNewProject}>
      <PlusOutlined />
      <MySpacer width={3} />
      New Project
    </CreateProjectButton>
    <CreateProjectButton onClick={openJoinExistingproject}>
      <UsergroupAddOutlined />
      <MySpacer width={3} />
      Join Project
    </CreateProjectButton>
  </div>
);

const DropdownMenuContainer = styled.div`
  background: ${MyTheme.colors.primary};
  color: ${MyTheme.colors.secondary};
  border-radius: 6px;
  padding: 16px 24px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
    rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  transition: all 0.3s ease;
`;

const ChangeUsernameButton = styled.button`
  font-size: 0.8em;
  :hover {
    color: ${MyTheme.colors.linkText};
  }
`;

const ActiveProjectDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 4px;
  font-weight: bold;
  transition: all 350ms ease;
  margin: 2px;
  color: ${MyTheme.colors.linkText};
  > * {
    color: ${MyTheme.colors.linkText};
  }
`;

const SwitchProjectButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  align-items: center;
  padding: 2px 4px;
  font-weight: bold;
  transition: all 350ms ease;
  margin: 2px;
  :hover {
    cursor: pointer;
    color: ${MyTheme.colors.linkText};
  }
`;

const CreateProjectButton = styled.button`
  display: flex;
  padding: 4px 8px;
  align-items: center;
  border-radius: 8px;
  border: 3px solid ${MyTheme.colors.secondary};
  color: ${MyTheme.colors.secondary};
  font-size: 0.8em;
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
