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

export const StatsCardLong = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;

  background-color: var(--secondary);
  border-radius: 0.5rem;
  margin: 0.5rem 0;
  padding: 0.8rem;

  & > *:not(:last-child) {
    border-right: 1px solid var(--accent);
    padding-right: 1rem;
    margin-right: .5rem;
  }

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
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  grid-template-rows: 1fr;
  grid-template-areas: "piechart legend";
  background-color: var(--secondary);
  border-radius: 0.5rem;
  margin: 0.5rem 0;
  padding: 0.8rem;
`;

export const StatsPieChart = styled.div`
`;

export const StatsPieChartLegend = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100%;
  padding: 0 1rem;
  margin: 1.5rem 0 0 0;
`;
