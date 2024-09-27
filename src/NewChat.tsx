interface ChatDisplayProps {
  user: string;
}

function NewChat({ user }: ChatDisplayProps) {

  return (
    <div id="mobileChat" style={{ display: "flex", background: "red", height: "100%" }}>
      <div style={{ height: "4rem", }}>

      </div>

    </div >);
}

export default NewChat;
