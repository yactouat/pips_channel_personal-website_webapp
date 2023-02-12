type AppPage = "home" | "profile";

interface MainLayoutProps {
  children: React.ReactNode;
  page?: AppPage;
}

export default MainLayoutProps;
