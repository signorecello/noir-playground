import NoirEditor from '../../src/components/NoirEditor';

import styled from "styled-components"

const Container = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`

const StyledHeader = styled.h1`
  color: #FFF;
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: 116%; /* 17.4px */
  display: flex;
  align-self: center;
`

const StyledEditor = styled(NoirEditor)`
  height: 100px;
  width: 100px;
`

export default function App() {
  return (
    <Container>
      <StyledHeader>Noir Playground</StyledHeader>
      <StyledEditor />
    </Container>
  )
}
