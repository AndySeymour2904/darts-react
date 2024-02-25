import React, { useRef, useEffect } from 'react';

function DartBoard(props) {
    const canvasRef = useRef(null);
    const arcSize = (2 * Math.PI) / 20;

    const green = '#008000';
    const red = '#ee2222';
    const black = '#222222';
    const white = '#eeeeee';

    const board_diam_mm = 451;
    const numbers_diam_mm = 350;
    const double_diam_mm = 340;
    const double_size_mm = 30;
    const treble_diam_mm = 214;
    const treble_size_mm = 30;
    const outer_bullseye_diam_mm = 50;
    const inner_bullseye_diam_mm = 20;

    const numbers = [
    6,10,15,2,17,3,19,7,16,8,11,14,9,12,5,20,1,18,4,13
    ]

    const draw = (ctx) => {
        const canvas = canvasRef.current
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = canvas.width / 2;
        const px_per_mm = canvas.width / board_diam_mm;
        
        // Draw the outer circle (black)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = black;
        ctx.fill();
        
        for (let i = 0; i < 20; ++i) {
            const startAngle = i * arcSize - (arcSize / 2);
            const endAngle = (i + 1) * arcSize - (arcSize / 2);
            
            // Double
            ctx.beginPath();
            ctx.moveTo(centerX, centerY); // Move the pen to (30, 50)
            ctx.arc(centerX, centerY, (px_per_mm * double_diam_mm) / 2, startAngle, endAngle);
            ctx.fillStyle = i % 2 === 0 ? green : red;
            ctx.fill();
            

            // Outer
            ctx.beginPath();
            ctx.moveTo(centerX, centerY); // Move the pen to (30, 50)
            ctx.arc(centerX, centerY, (px_per_mm * double_diam_mm) / 2 - double_size_mm, startAngle, endAngle);
            ctx.fillStyle = i % 2 === 0 ? white : black;
            ctx.fill();
            

            // Triple
            ctx.beginPath();
            ctx.moveTo(centerX, centerY); // Move the pen to (30, 50)
            ctx.arc(centerX, centerY, (px_per_mm * treble_diam_mm) / 2, startAngle, endAngle);
            ctx.fillStyle = i % 2 === 0 ? green : red;
            ctx.fill();
            
            // Inner
            ctx.beginPath();
            ctx.moveTo(centerX, centerY); // Move the pen to (30, 50)
            ctx.arc(centerX, centerY, (px_per_mm * treble_diam_mm) / 2 - treble_size_mm, startAngle, endAngle);
            ctx.fillStyle = i % 2 === 0 ? white : black;
            ctx.fill();

            // Numbers
            const angle = startAngle + arcSize / (numbers[i] < 10 ? 3 : 4)
            const x = centerX + numbers_diam_mm * Math.cos(angle);
            const y = centerY + numbers_diam_mm * Math.sin(angle);
        
            ctx.save(); // Save the current transformation state
            ctx.translate(x, y); // Translate to the character position
            ctx.rotate(angle + Math.PI / 2); // Rotate the character based on the angle
            ctx.font = '50px Arial';
            ctx.fillStyle = 'white';
            ctx.fillText(numbers[i], 0, 0);
            ctx.restore(); // Restore the original transformation state

        }
        
        // Outer bull
        ctx.beginPath();
        ctx.moveTo(centerX, centerY); // Move the pen to (30, 50)
        ctx.arc(centerX, centerY, (px_per_mm * outer_bullseye_diam_mm) / 2, 0, 2 * Math.PI);
        ctx.fillStyle = green;
        ctx.fill();
        
        // Inner bull
        ctx.beginPath();
        ctx.moveTo(centerX, centerY); // Move the pen to (30, 50)
        ctx.arc(centerX, centerY, (px_per_mm * inner_bullseye_diam_mm) / 2, 0, 2 * Math.PI);
        ctx.fillStyle = red;
        ctx.fill();
    }

    const handleClick = (event) => {
        const canvas = canvasRef.current
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const dx = x - (canvas.width / 2);
        const dy = y - (canvas.height / 2);
        
        const r = Math.sqrt(dx*dx + dy*dy);
        let theta = Math.atan2(dy, dx);

        if (theta < 0) {
            theta += 2 * Math.PI;
        }
        
        const px_per_mm = canvas.width / board_diam_mm;

        let score = 0
        let name = "unknown"
        
        if (r < ((px_per_mm * inner_bullseye_diam_mm) / 2)) { // bullseye
            score = 50
            name = "BULL"
        } else if (r < ((px_per_mm * outer_bullseye_diam_mm) / 2)) { // outer bull
            score = 25
            name = "25"
        } else if (r > ((px_per_mm * double_diam_mm) / 2)) { // miss
            score = 0
            name = "MISS"
        } else {
            // Definitely hit a number. Which?
            
            for (let i = 0; i < 20; ++i) {
            const startAngle = (i === 0 ? 2 * Math.PI : i * arcSize) - (arcSize / 2);
            const endAngle = (i + 1) * arcSize - (arcSize / 2);
        
            // At i = 0, number 6. We flip from 2 * Math.PI to 0
            if (startAngle > endAngle ? (theta >= startAngle || theta <= endAngle) : (theta >= startAngle && theta <= endAngle)) {
                score = numbers[i];
                name = score.toString()
                
                if (r >= ((px_per_mm * double_diam_mm) / 2) - double_size_mm) {
                    score *= 2;
                    name = "D" + name
                } else if (r <= ((px_per_mm * treble_diam_mm) / 2) && r >= ((px_per_mm * treble_diam_mm) / 2) - treble_size_mm) {
                    score *= 3;
                    name = "T" + name
                }
            }
            }
        }

        props.onDartRegistered({score, name})
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    draw(context);

    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('click', handleClick);
    };
  }, [draw, handleClick]);

  return <canvas ref={canvasRef} width={800} height={800} />;
}

export default DartBoard;
