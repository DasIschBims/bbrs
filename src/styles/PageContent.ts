import styled from "styled-components";

export const ContentWrapper = styled.div`
  margin: 0 auto 3rem auto;
  width: 100%;
  max-width: calc(100% - 20vw);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  height: 100%;
  padding: 1rem;

  @media (max-width: 600px) {
    > * {
      font-size: calc(0.8rem + 0.5vw);
    }
  }
`;