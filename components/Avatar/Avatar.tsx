import { useEffect, useState } from "react";
import s from "./Avatar.module.scss";

interface Props {
  name: string;
}

const Avatar = ({ name }: Props) => {
  const [abbreviation, setAbbreviation] = useState<string>("");

  useEffect(() => {
    const abbr = name.split(" ");
    const avatarName = abbr[0][0].toUpperCase() + abbr[1][0].toUpperCase();
    setAbbreviation(avatarName);
  }, [name]);

  return <div className={s.avatar}>{abbreviation}</div>;
};

export default Avatar;
