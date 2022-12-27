interface Props {
  children: React.ReactNode
}

export const Options: React.FC<Props> = ({ children }) => {
  return <div>Options {children}</div>
}
