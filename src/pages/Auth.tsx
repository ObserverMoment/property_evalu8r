import { Form, Input, Spin } from "antd";
import { useContext, useState } from "react";
import { SupabaseContext } from "../common/supabase";
import * as EmailValidator from "email-validator";
import { FlexRow, MySpacer, PageHeader } from "../components/styled/layout";
import { Header1, PrimaryButton } from "../components/styled/styled";
import { MyModal } from "../components/styled/modal";
import { useDisclosure } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { ReactSVG } from "react-svg";

function Auth() {
  // ChakraUI modal hook.
  const { isOpen, onOpen, onClose } = useDisclosure();
  const supabase = useContext(SupabaseContext);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const handleLogin = async () => {
    setLoading(true);

    // https://github.com/orgs/supabase/discussions/2760
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${
          process.env.PUBLIC_URL
            ? "https://" + process.env.PUBLIC_URL
            : "http://localhost:3000"
        }`,
      },
    });

    if (error) {
      console.log(error);
      setModalTitle("Oops, it didn't work");
      setModalMessage(error.message);
      onOpen();
    } else {
      setModalTitle("Almost there...");
      setModalMessage("Check your email for the login link!");
      onOpen();
    }
    setLoading(false);
  };

  return (
    <>
      <PageHeader>
        <Header1>Property Evalu8r</Header1>
        <div style={{ width: "28px" }}>
          <ReactSVG
            src="logo.svg"
            style={{ position: "relative", top: "1px" }}
          />
        </div>
      </PageHeader>
      <Text>Enter your email below to sign in via magic link.</Text>
      <MySpacer height={16} />
      <Form
        name="nest-messages"
        onFinish={handleLogin}
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
            {loading ? (
              <Spin size="small" />
            ) : (
              <PrimaryButton
                type="submit"
                disabled={loading || !EmailValidator.validate(email)}
              >
                Send Magic Link
              </PrimaryButton>
            )}
          </FlexRow>
        </Form.Item>
      </Form>

      <MyModal
        onConfirm={onClose}
        onClose={onClose}
        title={modalTitle}
        message={modalMessage}
        isOpen={isOpen}
        icon={<CheckCircleIcon color="" />}
      />
    </>
  );
}

export default Auth;
