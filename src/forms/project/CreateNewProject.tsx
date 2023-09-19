import { Input } from "antd";
import { MySpacer } from "../../components/styled/layout";
import { PrimaryButton } from "../../components/styled/styled";
import styled from "@emotion/styled";
import { useState } from "react";

interface CreateNewProjectProps {
  createNewProject: (pn: string, pw: string) => void;
}

const CreateNewProject = ({ createNewProject }: CreateNewProjectProps) => {
  const [projectName, setProjectName] = useState("");
  const [projectPassword, setProjectPassword] = useState("");

  const handleCreateNewProject = () => {
    createNewProject(projectName, projectPassword);
    setProjectName("");
    setProjectPassword("");
  };

  return (
    <div>
      <div style={{ fontWeight: "bold" }}>Create a New Project</div>
      <MySpacer height={20} />
      <Input
        placeholder="Project name (min 4 chars)"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />
      <InputRestrictionsText>Minumum of 6 characters</InputRestrictionsText>
      <MySpacer height={8} />
      <Input
        placeholder="Project password"
        value={projectPassword}
        onChange={(e) => setProjectPassword(e.target.value)}
      />
      <InputRestrictionsText>Minumum of 6 characters</InputRestrictionsText>
      <MySpacer height={20} />
      <PrimaryButton
        size="sm"
        disabled={projectName.length < 6 || projectPassword.length < 6}
        onClick={handleCreateNewProject}
      >
        Save
      </PrimaryButton>
    </div>
  );
};

const InputRestrictionsText = styled.div`
  font-size: 0.8em;
  opacity: 0.7;
  padding: 4px;
`;

export default CreateNewProject;
