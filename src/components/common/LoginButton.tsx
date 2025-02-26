import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import Button from './Button';

const LoginButton = ({ toggleLoginPopup }: { toggleLoginPopup: () => void }) => (
  <Button 
    type="button" 
    text="Login / Signup" 
    icon={faUserCircle}
    styleType="top-right-button"
    className="fixed top-5 right-20 z-50 rounded-full"
    iconSize='text-lg'
    onClick={toggleLoginPopup}
  />
);

export default LoginButton;