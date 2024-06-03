import { getChecksumAddress } from "starknet"

const normalizeAddress = (address: string) =>
  getChecksumAddress(address) as string

const formatTruncatedAddress = (address: string) => {
  const normalized = normalizeAddress(address)
  const hex = normalized.slice(0, 2)
  const start = normalized.slice(2, 6)
  const end = normalized.slice(-4)
  return `${hex}${start}…${end}`
}

const formatFullAddress = (address: string) => {
  const normalized = normalizeAddress(address)
  const hex = normalized.slice(0, 2)
  const rest = normalized.slice(2)
  const parts = rest.match(/.{1,4}/g) || []
  return `${hex} ${parts.join(" ")}`
}

export { normalizeAddress, formatTruncatedAddress, formatFullAddress }
