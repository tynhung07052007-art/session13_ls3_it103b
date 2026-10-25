
const tickets = [
    {
        pnr: "VN1001",
        passengerName: "Nguyen Van An",
        flightNumber: "VN202",
        ticketClass: "ECONOMY",
        frequentFlyerTier: "TITAN"
    },
    {
        pnr: "VN1002",
        passengerName: "Tran Thi Binh",
        flightNumber: "VN305",
        ticketClass: "BUSINESS",
        frequentFlyerTier: "GOLD"
    },
    {
        pnr: "VN1003",
        passengerName: "Le Minh Chau",
        flightNumber: "VN410",
        ticketClass: "ECONOMY",
        frequentFlyerTier: "NONE"
    }
];

const EXCESS_RATE_FIRST_5_KG = 60000;
const EXCESS_RATE_AFTER_5_KG = 80000;
const OVERSIZED_FEE = 200000;
const PET_FEE = 500000;
const EXTRA_FREE_KG = 10;

function findTicketByPnr(pnr) {
    return tickets.find(
        ticket => ticket.pnr === pnr.trim().toUpperCase()
    );
}

function getFreeBaggageAllowance(ticket) {
    const baseAllowance =
        ticket.ticketClass === "BUSINESS" ? 30 : 20;

    const eligibleTiers = [
        "TITAN",
        "GOLD",
        "PLATINUM",
        "DIAMOND"
    ];

    const extraAllowance = eligibleTiers.includes(
        ticket.frequentFlyerTier.toUpperCase()
    ) ? EXTRA_FREE_KG : 0;

    return baseAllowance + extraAllowance;
}

function calculateExcessFee(excessWeight) {
    if (excessWeight <= 0) {
        return 0;
    }

    const firstFiveKg = Math.min(excessWeight, 5);
    const remainingKg = Math.max(0, excessWeight - 5);

    return firstFiveKg * EXCESS_RATE_FIRST_5_KG
        + remainingKg * EXCESS_RATE_AFTER_5_KG;
}

function calculateBaggageSurcharge(ticket, baggageList) {
    const totalWeight = baggageList.reduce(
        (total, baggage) => total + baggage.weight,
        0
    );

    const freeAllowance = getFreeBaggageAllowance(ticket);
    const excessWeight = Math.max(
        0,
        totalWeight - freeAllowance
    );

    const excessFee = calculateExcessFee(excessWeight);

    const oversizedCount = baggageList.filter(
        baggage => baggage.type === "OVERSIZED"
    ).length;

    const petCount = baggageList.filter(
        baggage => baggage.type === "PET"
    ).length;

    const oversizedFee = oversizedCount * OVERSIZED_FEE;
    const petFee = petCount * PET_FEE;

    return {
        totalWeight,
        freeAllowance,
        excessWeight,
        excessFee,
        oversizedCount,
        oversizedFee,
        petCount,
        petFee,
        totalFee: excessFee + oversizedFee + petFee
    };
}

function formatMoney(amount) {
    return amount.toLocaleString("vi-VN") + " VNĐ";
}

function printReceipt(ticket, baggageList, result) {
    const line = "=".repeat(64);

    console.log("\n" + line);
    console.log("              BIEN LAI PHU CUOC HANH LY");
    console.log(line);
    console.log(`Ma PNR       : ${ticket.pnr}`);
    console.log(`Hanh khach   : ${ticket.passengerName}`);
    console.log(`Chuyen bay   : ${ticket.flightNumber}`);
    console.log(`Hang ve      : ${ticket.ticketClass}`);
    console.log(`Hoi vien     : ${ticket.frequentFlyerTier}`);
    console.log("-".repeat(64));
    console.log("CHI TIET HANH LY");

    baggageList.forEach((baggage, index) => {
        let typeName = "Thong thuong";

        if (baggage.type === "OVERSIZED") {
            typeName = "Cong kenh";
        } else if (baggage.type === "FRAGILE") {
            typeName = "De vo";
        } else if (baggage.type === "PET") {
            typeName = "Thu cung";
        }

        const description =
            `${index + 1}. ${baggage.name} (${typeName})`;

        console.log(
            `${description.padEnd(42)} ${String(baggage.weight).padStart(6)} kg`
        );
    });

    console.log("-".repeat(64));
    console.log(`Tong trong luong: ${result.totalWeight} kg`);
    console.log(`Mien cuoc       : ${result.freeAllowance} kg`);
    console.log(`Vuot cuoc       : ${result.excessWeight} kg`);
    console.log("-".repeat(64));
    console.log(`Phi qua cuoc    : ${formatMoney(result.excessFee)}`);
    console.log(`Phi cong kenh   : ${formatMoney(result.oversizedFee)}`);
    console.log(`Phi thu cung    : ${formatMoney(result.petFee)}`);
    console.log("-".repeat(64));
    console.log(`TONG THANH TOAN : ${formatMoney(result.totalFee)}`);
    console.log(line);
    console.log("Cam on quy khach!");
    console.log(line);
}

function inputBaggageList() {
    const baggageList = [];
    const countInput = prompt("Nhap so kien hanh ly (1-20):");

    if (countInput === null || countInput.trim() === "") {
        console.log("Da huy thao tac.");
        return null;
    }

    const count = Number(countInput);

    if (!Number.isInteger(count) || count < 1 || count > 20) {
        console.log("So kien phai tu 1 den 20.");
        return null;
    }

    for (let i = 0; i < count; i++) {
        const name = prompt(
            `Nhap ten kien hanh ly thu ${i + 1}:`
        );

        if (name === null || name.trim() === "") {
            console.log("Ten hanh ly khong duoc de trong.");
            return null;
        }

        const weightInput = prompt(
            `Nhap can nang kien ${i + 1} (kg):`
        );

        if (weightInput === null || weightInput.trim() === "") {
            console.log("Can nang khong duoc de trong.");
            return null;
        }

        const weight = Number(weightInput);

        if (!Number.isFinite(weight) || weight <= 0) {
            console.log("Can nang phai lon hon 0.");
            return null;
        }

        const typeInput = prompt(
            "Loai: NORMAL, FRAGILE, OVERSIZED, PET",
            "NORMAL"
        );

        if (typeInput === null) {
            return null;
        }

        const type = typeInput.trim().toUpperCase();
        const validTypes = [
            "NORMAL",
            "FRAGILE",
            "OVERSIZED",
            "PET"
        ];

        if (!validTypes.includes(type)) {
            console.log("Loai hanh ly khong hop le.");
            return null;
        }

        baggageList.push({
            name: name.trim(),
            weight,
            type
        });
    }

    return baggageList;
}

function processBaggageBilling() {
    const pnr = prompt("Nhap ma PNR:");

    if (pnr === null || pnr.trim() === "") {
        console.log("Ma PNR khong duoc de trong.");
        return;
    }

    const ticket = findTicketByPnr(pnr);

    if (!ticket) {
        console.log("Khong tim thay ve.");
        return;
    }

    const baggageList = inputBaggageList();

    if (baggageList === null) {
        return;
    }

    const result = calculateBaggageSurcharge(
        ticket,
        baggageList
    );

    printReceipt(ticket, baggageList, result);
}

function listTickets() {
    console.log("\n===== DANH SACH VE =====");

    tickets.forEach(ticket => {
        console.log(
            `${ticket.pnr} | ${ticket.passengerName} | ` +
            `${ticket.flightNumber} | ${ticket.ticketClass} | ` +
            `${ticket.frequentFlyerTier}`
        );
    });
}

function showMenu() {
    console.log("\n===== QUAN LY CUOC HANH LY =====");
    console.log("1. Xem danh sach ve");
    console.log("2. Tinh phi va in bien lai");
    console.log("3. Thoat");
}

function main() {
    let choice;

    do {
        showMenu();

        const input = prompt("Nhap lua chon tu 1 den 3:");
        choice = input === null ? "3" : input.trim();

        switch (choice) {
            case "1":
                listTickets();
                break;

            case "2":
                processBaggageBilling();
                break;

            case "3":
                console.log("Da thoat chuong trinh.");
                break;

            default:
                console.log("Lua chon khong hop le.");
        }
    } while (choice !== "3");
}

main();
