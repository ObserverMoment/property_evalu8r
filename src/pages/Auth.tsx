import { Button, Form, Input, Modal, Spin } from "antd";
import { FormEvent, useContext, useState } from "react";
import { SupabaseContext } from "../common/supabase";
import Paragraph from "antd/es/typography/Paragraph";
import * as EmailValidator from "email-validator";
import { FlexRow } from "../common/styled";

function Auth() {
  const supabase = useContext(SupabaseContext);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const handleLogin = async (event: FormEvent<HTMLInputElement>) => {
    console.log("login");

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setModalTitle("Oops, it didn't work");
      setModalMessage(error.message);
      setIsModalOpen(true);
    } else {
      setModalTitle("Almost there...");
      setModalMessage("Check your email for the login link!");
      setIsModalOpen(true);
    }
    setLoading(false);
  };

  return (
    <div>
      <Paragraph>Sign in via Magic Link with your email</Paragraph>
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
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>

        <Form.Item>
          <FlexRow justifyContent="center">
            <Button
              type="primary"
              htmlType="submit"
              disabled={loading || !EmailValidator.validate(email)}
            >
              {loading ? <Spin size="small" /> : <span>Send Magic Link</span>}
            </Button>
          </FlexRow>
        </Form.Item>
      </Form>
      <Modal
        title={modalTitle}
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        cancelButtonProps={{ hidden: true }}
      >
        <Paragraph>{modalMessage}</Paragraph>
      </Modal>
    </div>
  );
}

export default Auth;
