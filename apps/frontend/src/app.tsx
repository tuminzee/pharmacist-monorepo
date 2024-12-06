import "#/app.css";
import UploadImg from "#/components/upload-img";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

function App() {
  return (
    <>
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <div className="p-4">
        <UploadImg />
      </div>
    </>
  );
}

export default App;
