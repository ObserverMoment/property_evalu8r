import { Form, Input, Spin } from "antd";
import { useContext, useState } from "react";
import { SupabaseContext } from "../common/supabase";
import * as EmailValidator from "email-validator";
import { FlexRow, MySpacer } from "../components/styled/layout";
import { PrimaryButton } from "../components/styled/styled";
import { MyModal } from "../components/styled/modal";
import { useDisclosure } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

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
        emailRedirectTo: process.env.VERCEL_URL || "http://localhost:3000",
      },
    });

    if (error) {
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
      <Text>Sign in via Magic Link with your email</Text>
      <MySpacer height={16} />
      <Form
        name="nest-messages"
        onFinish={handleLogin}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          name={["user", "email"]}
          label="Email"
          rules={[{ type: "email" }]}
          required
        >
          <Input
            style={{ width: "300px" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
