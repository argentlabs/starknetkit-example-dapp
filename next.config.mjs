/** @type {import('next').NextConfig} */
import p from "./package.json" assert { type: "json" }

/* console.log(
  Object.entries(p.dependencies).find((dep) => {
    console.log(dep)
    return dep[0] === "starknetkit-next" ? dep[1] : null
  }),
) */ //.replace('^', '')

const nextConfig = {
  env: {
    starknetkitNextVersion: Object.entries(p.dependencies)
      .find((dep) => dep[0] === "starknetkit-next")[1]
      .replace("^", ""),
    starknetkitLatestVersion: Object.entries(p.dependencies)
      .find((dep) => dep[0] === "starknetkit-latest")[1]
      .replace("^", ""),

    starknetReactNextVersion: Object.entries(p.dependencies)
      .find((dep) => dep[0] === "starknet-react-core-next")[1]
      .replace("^", ""),
    starknetReactLatestVersion: Object.entries(p.dependencies)
      .find((dep) => dep[0] === "starknet-react-core-latest")[1]
      .replace("^", ""),
  },
}

export default nextConfig
