import useMediaQuery from './useMediaQuery.js'

export default function useFinePointer() {
  return useMediaQuery('(hover: hover) and (pointer: fine)')
}
