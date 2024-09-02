export const handleModalClick = (
  e: React.MouseEvent<HTMLDialogElement>,
  modal: HTMLDialogElement | null
) => {
  if (modal) {
    const dialogDimensions = modal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      modal.close();
    }
  }
};

export const handleSignInGithub = () => {
  window.location.assign(
    `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`
  );
};
