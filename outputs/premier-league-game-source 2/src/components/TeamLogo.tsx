type TeamLogoProps = {
  logo: string;
  name: string;
  small?: boolean;
};

export function TeamLogo({ logo, name, small = false }: TeamLogoProps) {
  return (
    <span className={`team-logo ${small ? "small" : ""}`} aria-label={`${name} logo`}>
      {logo}
    </span>
  );
}
