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
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
`;

export const CardContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
    gap: 1rem;
    width: 100%;
`;

export const StatsCardLong = styled.div`
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

  & > canvas {
    width: 12vh !important;
    height: 12vh !important;
  }
`;

export const StatsPieChartLegend = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  grid-gap: 0.2rem;
  max-width: 400px;
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