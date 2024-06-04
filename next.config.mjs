/** @type {import('next').NextConfig} */
import p from "./package.json" assert { type: "json" }

const starknetkitNextVersion = Object.entries(p.dependencies)
  .find((dep) => dep[0] === "starknetkit-next")[1]
  .replace("^", "")
  .replace("npm:", "")
  .split("@")[1]
const starknetkitLatestVersion = Object.entries(p.dependencies)
  .find((dep) => dep[0] === "starknetkit-latest")[1]
  .replace("^", "")
  .replace("npm:", "")
  .split("@")[1]
const starknetReactVersion = Object.entries(p.dependencies)
  .find((dep) => dep[0] === "@starknet-react/core")[1]
  .replace("^", "")
  .replace("npm:", "")
  .split("@")[0]

const nextConfig = {
  env: {
    starknetkitNextVersion,
    starknetkitLatestVersion,
    starknetReactVersion,
  },
}

export default nextConfig
