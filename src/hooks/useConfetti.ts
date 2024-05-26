import confetti from 'canvas-confetti';

const colors = ['#000', '#fff', '#b00', '#00b'];

const useConfetti = () => {
  const confettiAction = () => {
    confetti({
      particleCount: 100,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 100,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });
  };

  return { confettiAction };
};

export default useConfetti;
