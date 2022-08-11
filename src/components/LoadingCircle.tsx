import styled from "styled-components";

export default function LoadingCircle({ color, backgroundColor }: { color: string; backgroundColor: string }) {
  return (
    <Container backgroundColor={backgroundColor}>
      <MainCircle color={color}>
        <OverlappingCircle backgroundColor={backgroundColor} />
      </MainCircle>
    </Container>
  );
}

const Container = styled.div<{ backgroundColor: string }>`
  width: 10rem;
  height: 10rem;
  background-color: ${(props) => props.backgroundColor};
  display: flex;
  justify-content: center;
  align-items: center;
`;
const MainCircle = styled.div<{ color: string }>`
  width: 4rem;
  height: 4rem;
  position: relative;
  border: 10px solid ${(props) => props.color};
  border-radius: 50%;
  animation: 0.8s infinite linear rotate;

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const OverlappingCircle = styled.div<{ backgroundColor: string }>`
  width: 3rem;
  height: 3rem;
  left: -98%;
  position: absolute;
  background-color: ${(props) => props.backgroundColor};
  transform: rotate(45deg) skew(0deg, 349deg);
`;
