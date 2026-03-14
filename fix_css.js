const fs = require('fs');
const path = 'c:/Users/vsara/Desktop/visionCart/my-app/visioncart/src/Pages/Orders.css';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

// Keep only the first 355 lines (up to the closing brace of the last media query)
const cleanLines = lines.slice(0, 355);

const newContent = cleanLines.join('\n') + `
/* Order Status Timeline */
.order-status-timeline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 25px 80px;
    background: #fafafa;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
}

.timeline-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 2;
}

.timeline-step .dot {
    width: 16px;
    height: 16px;
    background: #e0e0e0;
    border-radius: 50%;
    border: 3px solid #fff;
    box-shadow: 0 0 0 1px #e0e0e0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.timeline-step span {
    font-size: 11px;
    font-weight: 700;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.timeline-step.active .dot {
    background: #001529;
    box-shadow: 0 0 0 1px #001529;
}

.timeline-step.active span {
    color: #001529;
}

.timeline-line {
    flex: 1;
    height: 2px;
    background: #e0e0e0;
    margin: -22px 5px 0;
}

@media (max-width: 600px) {
    .order-status-timeline {
        padding: 20px;
    }
    .timeline-step span {
        font-size: 9px;
    }
}
`;

fs.writeFileSync(path, newContent);
console.log('File cleaned and updated successfully');
