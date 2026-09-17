import { getGithubUser } from "../handlers/github_handlers";

export interface GitAuthor {
  name: string;
  email: string;
}

export async function getGitAuthor(): Promise<GitAuthor> {
  const user = await getGithubUser();
  const author = user
    ? {
        name: "KapAble",
        email: user.email,
      }
    : {
        name: "KapAble",
        // Used when no GitHub account is connected. Deliberately on a domain
        // that cannot receive mail, rather than one this project does not own.
        email: "kapable@users.noreply.github.com",
      };
  return author;
}
