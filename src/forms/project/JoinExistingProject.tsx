import { Input } from "antd";
import { FlexRow, MySpacer } from "../../components/styled/layout";
import { PrimaryButton } from "../../components/styled/styled";
import styled from "@emotion/styled";
import { useState } from "react";

interface JoinExistingProjectProps {
  joinExistingProject: (pn: string, pw: string) => void;
}

const JoinExistingProject = ({
  joinExistingProject,
}: JoinExistingProjectProps) => {
  const [projectName, setProjectName] = useState("");
  const [projectPassword, setProjectPassword] = useState("");

  const handleJoinExistingProject = () => {
    joinExistingProject(projectName, projectPassword);
    setProjectName("");
    setProjectPassword("");
  };

  return (
    <div>
      <div style={{ fontWeight: "bold" }}>Join Existing Project</div>
      <MySpacer height={20} />
      <InputRestrictionsText>
        You can request this information from your project owner.
      </InputRestrictionsText>
      <MySpacer height={20} />
      <Input
        placeholder="Project name (min 4 chars)"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />
      <MySpacer height={8} />
      <Input
        placeholder="Project password"
        value={projectPassword}
        onChange={(e) => setProjectPassword(e.target.value)}
      />
      <MySpacer height={20} />
      <FlexRow justifyContent="space-evenly">
        <PrimaryButton
          size="sm"
          disabled={projectName.length < 6 || projectPassword.length < 6}
          onClick={handleJoinExistingProject}
        >
          Request to Join
        </PrimaryButton>
      </FlexRow>
    </div>
  );
};

const InputRestrictionsText = styled.div`
  font-size: 0.8em;
  opacity: 0.7;
  padding: 4px;
`;

export default JoinExistingProject;
