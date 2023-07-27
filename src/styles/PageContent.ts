import styled from "styled-components";

export const ContentWrapper = styled.div`
  margin: 0 auto;
  padding: 20px;
  width: 100%;
  max-width: calc(100% - 20vw);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;

  @media (max-width: 600px) {
    > * {
      font-size: calc(0.8rem + 0.5vw);
    }
  }
`;