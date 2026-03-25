let name1 = prompt("Enter your name");

let headingElement = document.querySelector(".name-heading");

if (name1 && name1.trim() !== "") {
    headingElement.innerHTML = `Hi, ${name1} 👋`;
} else {
    headingElement.innerHTML = "Hi, Guest 👋";
}

const teamColors = {
    India: "#0055A4", Australia: "#004B35", England: "#E00000",
    "South Africa": "#FFCD00", Pakistan: "#01411C", "West Indies": "#7B0031",
    "New Zealand": "#000000", "Sri Lanka": "#003399", Zimbabwe: "#FFD700",
    Bangladesh: "#006A4E", Afghanistan: "#0047AB", Ireland: "#009A44", USA: "#3C3B6E",
    Namibia: "#003DA5", Netherlands: "#FF6A00", Nepal: "#DC143C"
};

const opponentSelect = document.getElementById("opponent");
const customInput = document.getElementById("customOpponent");
const ctx = document.getElementById('performanceChart');
const runsCtx = document.getElementById('runsBarChart');

const outSelect = document.getElementById("out");
const dismissalTypeSelect = document.getElementById("dismissal_type");

outSelect.addEventListener("change", () => {
    if (outSelect.value === "true") {
        dismissalTypeSelect.style.display = "inline-block";
    } else {
        dismissalTypeSelect.style.display = "none";
    }
});

let matches = [];

// Handle "Other" opponent input
opponentSelect.addEventListener("change", () => {
    customInput.style.display = opponentSelect.value === "Other" ? "block" : "none";
});

// Initialize Main Chart
const performanceChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Runs',
            data: [],
            backgroundColor: '#4f46e5',
            borderRadius: 6,
            // Reduced thickness for a more professional, minimalist look
            barThickness: 25,
            maxBarThickness: 30
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 10,
                bottom: 35 // Increased padding to ensure labels don't hit the container edge
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255,255,255,0.1)' },
                ticks: { color: '#ffffff', font: { size: 12 } }
            },
            x: {
                ticks: {
                    color: '#fff',
                    padding: 10, // Distance between the axis line and the M1, M2 labels
                    font: { size: 11, weight: '500' }
                },
                grid: { display: false }
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e1e1e',
                titleFont: { size: 14 },
                bodyFont: { size: 13 },
                padding: 12,
                displayColors: false
            }
        }
    }
});

// Initialize Mini Sparkline for Total Runs
const runsBarChart = new Chart(runsCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            data: [],
            borderColor: '#4f46e5',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 0,
            fill: true,
            backgroundColor: 'rgba(79, 70, 229, 0.1)'
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false } },
        maintainAspectRatio: false
    }
});

document.querySelector('.match-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const matchDate = document.getElementById('matchDate').value;
    const runs = Number(document.getElementById('runs').value);
    const balls = Number(document.getElementById('balls').value);
    const fours = Number(document.getElementById('fours').value) || 0;
    const sixes = Number(document.getElementById('sixes').value) || 0;
    const dots = Number(document.getElementById('dots').value) || 0;
    const out = document.getElementById('out').value === 'true';
    let opponent = opponentSelect.value === "Other" ? customInput.value.trim() : opponentSelect.value;
    let dismissal;
    if (out) {
        dismissal = document.getElementById('dismissal_type').value;
    } else {
        dismissal = "Not Out";
    }

    matches.push({ runs, balls, out, opponent, dismissal, fours, sixes, dots, matchDate });
    this.reset();
    customInput.style.display = "none";
    updateDashboard();
});

function updateDashboard() {
    const totalRuns = matches.reduce((sum, m) => sum + m.runs, 0);
    const totalBalls = matches.reduce((sum, m) => sum + m.balls, 0);
    const outs = matches.filter(m => m.out).length;

    document.getElementById("totalMatches").innerText = matches.length;
    document.getElementById("totalRuns").innerText = totalRuns;
    document.getElementById("average").innerText = outs === 0 ? totalRuns : (totalRuns / outs).toFixed(2);
    document.getElementById("strikeRate").innerText = totalBalls === 0 ? "0.00" : ((totalRuns / totalBalls) * 100).toFixed(2);
    document.getElementById("100").innerText = matches.filter(m => m.runs >= 100).length;
    document.getElementById("50").innerText = matches.filter(m => m.runs >= 50 && m.runs < 100).length;
    document.getElementById("highestScore").innerText = matches.length === 0 ? 0 : Math.max(...matches.map(m => m.runs));

    calculateWeakestTeam();
    calculateStrongestTeam();
    updateCharts();
    updateDismissalChart();
    updateBoundaryStats();
    updateDotStats();
    updateImpactScore();
    updateHeatmap();
}

function calculateWeakestTeam() {
    if (matches.length === 0) return;
    const teamStats = {};
    matches.forEach(m => {
        if (!teamStats[m.opponent]) teamStats[m.opponent] = { runs: 0, outs: 0 };
        teamStats[m.opponent].runs += m.runs;
        if (m.out) teamStats[m.opponent].outs += 1;
    });

    let weakestTeam = "none";
    let lowestAvg = Infinity;
    let weakestAvg = 0;

    for (let team in teamStats) {
        const avg = teamStats[team].outs === 0 ? teamStats[team].runs : teamStats[team].runs / teamStats[team].outs;
        if (avg < lowestAvg) { lowestAvg = avg; weakestTeam = team; weakestAvg = avg; }
    }
    document.getElementById("weakestTeam").innerText = weakestTeam;
    document.getElementById("weakestAvg").innerText = "Avg: " + weakestAvg.toFixed(2);
}

function calculateStrongestTeam() {

    if (matches.length === 0) return;

    const teamStats = {};

    matches.forEach(m => {

        if (!teamStats[m.opponent]) {
            teamStats[m.opponent] = { runs: 0, outs: 0 };
        }

        teamStats[m.opponent].runs += m.runs;

        if (m.out) {
            teamStats[m.opponent].outs += 1;
        }

    });

    let strongestTeam = "none";
    let highestAvg = -Infinity;
    let strongestAvg = 0;

    for (let team in teamStats) {

        const runs = teamStats[team].runs;
        const outs = teamStats[team].outs;

        const avg = outs === 0
            ? runs
            : runs / outs;

        if (avg > highestAvg) {
            highestAvg = avg;
            strongestTeam = team;
            strongestAvg = avg;
        }
    }

    document.getElementById("strongestTeam").innerText = strongestTeam;
    document.getElementById("strongestAvg").innerText = "Avg: " + strongestAvg.toFixed(2);
}

const dismissalCtx = document.getElementById("dismissalChart");

const dismissalChart = new Chart(dismissalCtx, {
    type: "pie",
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [
                "#FF6384", // caught
                "#36A2EB", // bowled
                "#FFCE56", // lbw
                "#4BC0C0", // run out
                "#9966FF"  // stumped
            ]
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: "#ffffff",
                    font: { size: 12 },
                    padding: 15
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        if (total === 0) return `${context.label} → 0%`;
                        const value = context.raw;
                        const percent = ((value / total) * 100).toFixed(0);
                        return `${context.label} → ${percent}%`;
                    }
                }
            }
        }
    }
});

const dotGaugeCtx = document.getElementById("dotGaugeChart");
const dotGaugeChart = new Chart(dotGaugeCtx, {
    type: "doughnut",
    data: {
        labels: ["Dot Balls", "Scoring Balls"],
        datasets: [{
            data: [0, 100],
            backgroundColor: ["#22c55e", "rgba(255, 255, 255, 0.1)"],
            borderWidth: 0,
            circumference: 180,
            rotation: -90
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
        }
    }
});


function updateDismissalChart() {

    const dismissalStats = {
        "Caught": 0,
        "Bowled": 0,
        "LBW": 0,
        "Run Out": 0,
        "Stumped": 0
    };

    let hasDismissals = false;
    let totalDismissals = 0;

    matches.forEach(match => {
        if (match.out) {
            const type = match.dismissal || "Caught";
            if (dismissalStats[type] !== undefined) {
                dismissalStats[type]++;
                hasDismissals = true;
                totalDismissals++;
            }
        }
    });

    const labels = [];
    const data = [];
    let maxType = "";
    let maxCount = 0;

    for (const [key, value] of Object.entries(dismissalStats)) {
        if (value > 0 || !hasDismissals) {
            labels.push(key);
            data.push(value);
        }
        if (value > maxCount) {
            maxCount = value;
            maxType = key;
        }
    }

    dismissalChart.data.labels = labels;
    dismissalChart.data.datasets[0].data = data;

    dismissalChart.update();

    if (!hasDismissals) {
        document.getElementById("dismissalInsight").innerText = "No dismissals yet. Keep it up!";
        return;
    }

    let percent = Math.round((maxCount / totalDismissals) * 100);
    let advice = "";
    if (maxType === "Caught") {
        advice = "try timing the ball and play less aerial shots.";
    } else if (maxType === "Bowled") {
        advice = "focus on playing with a straight bat and protecting your stumps.";
    } else if (maxType === "LBW") {
        advice = "try improving your footwork.";
    } else if (maxType === "Run Out") {
        advice = "work on clear calling and running speed.";
    } else if (maxType === "Stumped") {
        advice = "be careful when stepping out of the crease.";
    }

    document.getElementById("dismissalInsight").innerText = `You are getting ${maxType} more often (${percent}% of dismissals), ${advice}`;
}

function updateCharts() {
    // Update Main Chart
    performanceChart.data.labels = matches.map((_, i) => `M${i + 1}`);
    performanceChart.data.datasets[0].data = matches.map(m => m.runs);
    performanceChart.data.datasets[0].backgroundColor = matches.map(m => teamColors[m.opponent] || "#4f46e5");
    performanceChart.update();

    // Update Sparkline
    runsBarChart.data.labels = matches.map((_, i) => i);
    runsBarChart.data.datasets[0].data = matches.map((_, i) => matches.slice(0, i + 1).reduce((s, m) => s + m.runs, 0));
    runsBarChart.update();
}

function updateBoundaryStats() {
    if (matches.length === 0) {
        document.getElementById("boundaryRunsText").innerText = "0";
        document.getElementById("runningRunsText").innerText = "0";
        document.getElementById("boundaryPercentageText").innerText = "0%";
        document.getElementById("boundaryProgressBar").style.width = "0%";
        document.getElementById("runningProgressBar").style.width = "0%";
        document.getElementById("boundarySplitText").innerText = "0 (4s) / 0 (6s)";
        document.getElementById("foursProgressBar").style.width = "0%";
        document.getElementById("sixesProgressBar").style.width = "0%";
        document.getElementById("boundaryInsight").innerText = "Add matches to see batting approach insights.";
        return;
    }

    let totalRuns = 0;
    let totalBoundaryRuns = 0;
    let totalFours = 0;
    let totalSixes = 0;

    matches.forEach(m => {
        totalRuns += m.runs;
        let f = m.fours || 0;
        let s = m.sixes || 0;
        totalFours += f;
        totalSixes += s;
        totalBoundaryRuns += (f * 4) + (s * 6);
    });

    let runningRuns = totalRuns - totalBoundaryRuns;
    if (runningRuns < 0) runningRuns = 0;

    let boundaryPercentage = totalRuns === 0 ? 0 : (totalBoundaryRuns / totalRuns) * 100;
    let runningPercentage = totalRuns === 0 ? 0 : (runningRuns / totalRuns) * 100;

    document.getElementById("boundaryRunsText").innerText = totalBoundaryRuns;
    document.getElementById("runningRunsText").innerText = runningRuns;
    document.getElementById("boundaryPercentageText").innerText = boundaryPercentage.toFixed(1) + "%";
    document.getElementById("boundaryProgressBar").style.width = boundaryPercentage + "%";
    document.getElementById("runningProgressBar").style.width = runningPercentage + "%";

    let totalBoundariesCount = totalFours + totalSixes;
    let foursPercentage = totalBoundariesCount === 0 ? 0 : (totalFours / totalBoundariesCount) * 100;
    let sixesPercentage = totalBoundariesCount === 0 ? 0 : (totalSixes / totalBoundariesCount) * 100;

    document.getElementById("boundarySplitText").innerText = `${totalFours} (4s) / ${totalSixes} (6s)`;
    document.getElementById("foursProgressBar").style.width = foursPercentage + "%";
    document.getElementById("sixesProgressBar").style.width = sixesPercentage + "%";

    let formattedPercentage = boundaryPercentage.toFixed(0);
    let insight = "";
    if (boundaryPercentage > 60) {
        insight = `${formattedPercentage}% of your runs come from boundaries, showing a radical and aggressive batting approach.`;
    } else if (boundaryPercentage >= 40 && boundaryPercentage <= 60) {
        insight = `${formattedPercentage}% of your runs come from boundaries, showing a balanced batting approach.`;
    } else {
        insight = `${formattedPercentage}% of your runs come from boundaries, showing a defensive batting approach.`;
    }

    document.getElementById("boundaryInsight").innerText = insight;
}

function updateDotStats() {
    if (matches.length === 0) {
        document.getElementById("dotPercentageValue").innerText = "0%";
        document.getElementById("dotBallsText").innerText = "0";
        document.getElementById("totalBallsText").innerText = "0";
        dotGaugeChart.data.datasets[0].data = [0, 100];
        dotGaugeChart.data.datasets[0].backgroundColor = ["#22c55e", "rgba(255, 255, 255, 0.1)"];
        dotGaugeChart.update();
        document.getElementById("dotInsight").innerText = "Add matches to see dot ball pressure insights.";
        return;
    }

    let totalBalls = 0;
    let totalDots = 0;

    matches.forEach(m => {
        totalBalls += m.balls;
        totalDots += (m.dots || 0);
    });

    let dotPercentage = totalBalls === 0 ? 0 : (totalDots / totalBalls) * 100;

    document.getElementById("dotPercentageValue").innerText = dotPercentage.toFixed(1) + "%";
    document.getElementById("dotBallsText").innerText = totalDots;
    document.getElementById("totalBallsText").innerText = totalBalls;

    let chartColor = "#22c55e"; // Default Green
    let insight = "";

    let ballsPerDot = totalDots === 0 ? "0" : (totalBalls / totalDots).toFixed(1);

    if (dotPercentage < 30) {
        chartColor = "#22c55e"; // Green
        insight = `Excellent, no pressure! You faced a dot ball every ${ballsPerDot} deliveries, showing great strike rotation.`;
    } else if (dotPercentage <= 45) {
        chartColor = "#eab308"; // Yellow
        insight = `Moderate pressure. You faced a dot ball every ${ballsPerDot} deliveries. Keep focusing on rotating the strike.`;
    } else {
        chartColor = "#ff4d4d"; // Red
        insight = `High pressure! You faced a dot ball every ${ballsPerDot} deliveries, indicating pressure building. Try rotating the strike to reduce pressure.`;
    }

    dotGaugeChart.data.datasets[0].data = [dotPercentage, 100 - dotPercentage];
    dotGaugeChart.data.datasets[0].backgroundColor = [chartColor, "rgba(255, 255, 255, 0.1)"];
    dotGaugeChart.update();

    document.getElementById("dotInsight").innerText = insight;
}

function updateImpactScore() {
    if (matches.length === 0) {
        document.getElementById("impactLeaderboard").innerHTML = '<div style="font-size: 12px; opacity: 0.5; text-align: center; padding: 20px 0;">Add matches to see impact scores.</div>';
        document.getElementById("impactInsight").innerText = "No impactful innings yet.";
        return;
    }

    let impactData = matches.map((m) => {
        let sr = m.balls === 0 ? 0 : (m.runs / m.balls) * 100;
        let boundaryRuns = ((m.fours || 0) * 4) + ((m.sixes || 0) * 6);
        let boundaryPercentage = m.runs === 0 ? 0 : (boundaryRuns / m.runs) * 100;
        
        let score = m.runs + (sr * 0.3) + (boundaryPercentage * 0.2);
        
        return {
            ...m,
            sr: sr,
            impactScore: score
        };
    });

    impactData.sort((a, b) => b.impactScore - a.impactScore);
    let top3 = impactData.slice(0, 3);

    let listHTML = '';
    top3.forEach((match, i) => {
        let rankClass = i === 0 ? "lb-gold" : (i === 1 ? "lb-silver" : "lb-bronze");
        let trophy = i === 0 ? '🏆' : (i === 1 ? '🥈' : '🥉');
        
        listHTML += `
            <li class="leaderboard-item ${rankClass}">
                <div class="lb-match-info">
                    <span class="lb-match-title">${trophy} vs ${match.opponent}</span>
                    <span class="lb-match-desc">${match.runs}(${match.balls}) | SR: ${match.sr.toFixed(0)}</span>
                </div>
                <div class="lb-score">${match.impactScore.toFixed(0)}</div>
            </li>
        `;
    });
    
    document.getElementById("impactLeaderboard").innerHTML = listHTML;

    let topMatch = top3[0];
    document.getElementById("impactInsight").innerText = `Your most impactful innings was ${topMatch.runs}(${topMatch.balls}) vs ${topMatch.opponent} with an impact score of ${topMatch.impactScore.toFixed(0)}!`;
}

function updateHeatmap() {
    let heatmapGrid = document.getElementById("heatmapGrid");
    
    let runsByDate = {};
    matches.forEach(m => {
        if (!m.matchDate) return;
        if (!runsByDate[m.matchDate]) runsByDate[m.matchDate] = 0;
        // The heatmap maps to total runs or highest runs? User said "runs_scored". We will sum for that day or assign. 
        runsByDate[m.matchDate] += m.runs;
    });

    let endDate = new Date(); // today
    let startDate = new Date();
    startDate.setDate(endDate.getDate() - 364);

    let weeksHTML = [];
    let currentWeek = [];
    let currDate = new Date(startDate);
    
    // Fast forward to Sunday to maintain week shape optionally, but linear is fine for flex-wrap.
    while (currDate <= endDate) {
        let y = currDate.getFullYear();
        let m = String(currDate.getMonth() + 1).padStart(2, '0');
        let dStr = String(currDate.getDate()).padStart(2, '0');
        let dateString = `${y}-${m}-${dStr}`;
        
        let runs = runsByDate[dateString];
        
        let color = "rgba(255, 255, 255, 0.05)";
        if (runs !== undefined) {
            if (runs === 0) color = "#333333";
            else if (runs >= 1 && runs <= 20) color = "#bbf7d0";
            else if (runs >= 21 && runs <= 50) color = "#22c55e"; 
            else if (runs > 50) color = "#166534";
        }

        let title = runs !== undefined ? `${runs} runs on ${dateString}` : `No matches on ${dateString}`;
        
        currentWeek.push(`<div style="width: 14px; height: 14px; background: ${color}; border-radius: 3px; cursor: pointer;" title="${title}"></div>`);
        
        currDate.setDate(currDate.getDate() + 1);
        
        // Every 7 days, push a new column
        if (currentWeek.length === 7 || currDate > endDate) {
            weeksHTML.push(`<div style="display: flex; flex-direction: column; gap: 4px;">${currentWeek.join('')}</div>`);
            currentWeek = [];
        }
    }

    heatmapGrid.innerHTML = weeksHTML.join('');

    // Insights logic
    if (matches.length > 0) {
        let monthRuns = {};
        matches.forEach(m => {
            if (!m.matchDate) return;
            let month = new Date(m.matchDate).toLocaleString('default', { month: 'long' });
            if (!monthRuns[month]) monthRuns[month] = { runs: 0, matches: 0 };
            monthRuns[month].runs += m.runs;
            monthRuns[month].matches += 1;
        });

        let months = Object.keys(monthRuns);
        if (months.length > 1) {
            let bestMonth = months[0];
            let worstMonth = months[0];

            for (let mt of months) {
                if (monthRuns[mt].runs > monthRuns[bestMonth].runs) bestMonth = mt;
                if (monthRuns[mt].runs < monthRuns[worstMonth].runs) worstMonth = mt;
            }

            if (bestMonth !== worstMonth) {
                document.getElementById("heatmapInsight").innerText = `You scored consistently in ${bestMonth} (${monthRuns[bestMonth].runs} runs) but struggled in ${worstMonth} (${monthRuns[worstMonth].runs} runs).`;
            } else {
                document.getElementById("heatmapInsight").innerText = `Steady scoring in ${bestMonth} with ${monthRuns[bestMonth].runs} runs. Register matches in different months to see comparisons!`;
            }
        } else if (months.length === 1) {
            document.getElementById("heatmapInsight").innerText = `You have scored ${monthRuns[months[0]].runs} runs across ${months[0]}. Keep adding matches next month!`;
        }
    } else {
        document.getElementById("heatmapInsight").innerText = "Add matches to see calendar insights.";
    }
}