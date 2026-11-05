import { join, resolve } from "path";
import { writeFileSync, existsSync, mkdirSync, readFileSync } from "fs";

type LoginData = {
  email: string;
  pass: string;
};

function getAuthDir(): string {
  return resolve(__dirname, join("..", "data", ".auth"));
}

console.log(getAuthDir());

function getLoginDataPath(): string {
  return join(getAuthDir(), "loginData.json");
}

console.log(getLoginDataPath());

export function getAuthSessionPath(): string {
  return join(getAuthDir(), "user.json");
}

export function loginDataFileExists(): boolean {
  return existsSync(getLoginDataPath());
}

export function writeLoginData(loginData: LoginData): void {
  const authDir = getAuthDir();
  if (!existsSync(authDir)) {
    mkdirSync(authDir, { recursive: true });
  }
  writeFileSync(getLoginDataPath(), JSON.stringify(loginData, null, 2));
}

export function readLoginData() {
  if (loginDataFileExists()) {
    return JSON.parse(readFileSync(getLoginDataPath(), "utf-8")) as LoginData;
  }
  return undefined;
}
