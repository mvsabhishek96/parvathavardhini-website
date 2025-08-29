import { Button } from "@/components/ui/button";

interface AuthButtonProps {
  onClick: () => void;
  text: string;
  icon: string;
  disabled?: boolean;
}

const AuthButton = ({ onClick, text, icon, disabled }: AuthButtonProps) => {
  return (
    <Button onClick={onClick} disabled={disabled}>
      <span>{text}</span>
      <i className={icon}></i>
    </Button>
  );
};

export default AuthButton;
