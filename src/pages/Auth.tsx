import { Form, Input, Spin } from "antd";
import { useContext, useState } from "react";
import { SupabaseContext } from "../common/supabase";
import * as EmailValidator from "email-validator";
import { FlexRow, MySpacer, PageHeader } from "../components/styled/layout";
import { Header1, PrimaryButton } from "../components/styled/styled";
import { Text } from "@chakra-ui/react";
import { ReactSVG } from "react-svg";
import { MessageInstance } from "antd/es/message/interface";
import { AccesscodeInput } from "../components/AccessCodeInput";

interface AuthProps {
  messageApi: MessageInstance;
}

function Auth({ messageApi }: AuthProps) {
  const supabase = useContext(SupabaseContext);

  const [loadingRequestCode, setLoadingRequestCode] = useState(false);
  const [loadingSubmitCode, setLoadingSubmitCode] = useState(false);
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleRequestAccessCode = async () => {
    setLoadingRequestCode(true);
    // https://github.com/orgs/supabase/discussions/2760
    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      console.error(error);
      messageApi.error(error.message);
    } else {
      setOtpSent(true);
    }
    setLoadingRequestCode(false);
  };

  const handleSubmitAccessCode = async (accessCode: string) => {
    console.log(accessCode);
    setLoadingSubmitCode(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: accessCode,
      type: "email",
    });

    if (error) {
      console.error(error);
      messageApi.error(error.message);
    }

    setLoadingSubmitCode(false);
    setOtpSent(false);
  };

  return (
    <>
      <PageHeader>
        <Header1>Property Evaluator</Header1>
        <div style={{ width: "28px" }}>
          <ReactSVG
            src="logo.svg"
            style={{ position: "relative", top: "1px" }}
          />
        </div>
      </PageHeader>
      <MySpacer height={24} />
      <Text>
        Enter your email below and we will send you a one time access code.
      </Text>
      <MySpacer height={16} />
      <Form
        name="nest-messages"
        onFinish={handleRequestAccessCode}
        style={{ maxWidth: 600 }}
        layout="vertical"
      >
        <Form.Item
          name={["user", "email"]}
          rules={[{ type: "email" }]}
          required
        >
          <Input
            style={{ width: "300px" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </Form.Item>

        <Form.Item>
          <FlexRow justifyContent="center">
            {loadingRequestCode ? (
              <Spin size="small" />
            ) : (
              <PrimaryButton
                type="submit"
                disabled={
                  otpSent ||
                  loadingRequestCode ||
                  !EmailValidator.validate(email)
                }
              >
                Send Access Code
              </PrimaryButton>
            )}
          </FlexRow>
        </Form.Item>
      </Form>

      {otpSent && (
        <AccesscodeInput
          handleSubmitAccessCode={handleSubmitAccessCode}
          loadingSubmitCode={loadingSubmitCode}
        />
      )}
    </>
  );
}

export default Auth;
