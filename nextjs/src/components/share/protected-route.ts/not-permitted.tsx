import { Button, Result } from "antd";
import { useRouter } from "next/navigation";

const NotPermitted = () => {
  const router = useRouter();
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Button type="primary" onClick={() => router.push("/home")}>
          Back Home
        </Button>
      }
    />
  );
};

export default NotPermitted;
