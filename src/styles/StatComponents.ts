import styled from "styled-components";

export const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  padding: 0 1rem;
  margin: 0;
`;

export const PieContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(425px, 1fr));
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  }
`;

export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(425px, 1fr));
  gap: 1rem;
  width: 100%;

  @media (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  }
`;

export const StatsCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;

  background-color: var(--secondary);
  border-radius: 0.5rem;
  margin: 0.5rem 0;
  padding: 0.8rem;

  & > * {
    padding: 0.8rem;
    display: flex;
    flex-direction: column;
    font-size: 1.2rem;

    & > *:first-child {
      display: flex;
      align-items: center;
    }

    & > * > svg {
      margin-right: 0.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;
    justify-content: center;

    & > * {
      padding: 0.5rem;
      margin: 0.5rem 0;
    }
  }
`;

export const StatsPieChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--secondary);
  border-radius: 0.5rem;
  padding: 0.8rem;
`;

export const StatsPieChart = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const PieChartWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 400px;
  height: 400px;
  margin: 0 auto;

  @media (max-width: 600px) {
    width: 300px;
    height: 300px;
  }
`;

export const StatsPieChartLegend = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  grid-gap: 0.2rem;
  max-width: 420px;
  margin-top: 1rem;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 0.5rem;
`;

export const LegendColor = styled.span`
  background-color: ${(props) => props.color};
  min-width: 20px;
  min-height: 20px;
  display: inline-block;
  margin: 0 5px;
  border-radius: 50%;
`;

export const LegendText = styled.p`
  margin: 0;
  display: flex;
`;

export const StatChartTitle = styled.h3`
  padding: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text);
  width: 100%;
  text-align: center;
  margin-bottom: 0.8rem;
`;

export const LineChartWrapper = styled.div`
  background-color: var(--secondary);
  border-radius: 0.5rem;
  margin: 0.5rem 0;
  padding: 0.8rem;
  height: 100%;
`;

export const LineChartContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(850px, 1fr));
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;

  @media (max-width: 2000px) {
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  }

  @media (max-width: 1400px) {
    grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
    gap: 3rem;
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
    gap: 2.5rem;
    margin-bottom: 1.5rem;
  }
`;