const API_BASE_URL =
  "http://ec2-3-111-219-88.ap-south-1.compute.amazonaws.com:3000";

/*
=====================================================
GET SCREENS FOR THEATER
=====================================================
*/

export const getTheaterScreens = async (theaterId) => {
  if (!theaterId) {
    throw new Error("Theater ID is required");
  }

  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  const response = await fetch(
    `${API_BASE_URL}/theaters/${theaterId}/screens`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch screen details: ${response.status}`
    );
  }

  const data = await response.json();

  console.log("RAW SCREEN API:", data);

  return data;
};


/*
=====================================================
NORMALIZE SCREENS
=====================================================
*/

export const normalizeScreens = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.screens)) {
    return response.screens;
  }

  if (Array.isArray(response?.data?.screens)) {
    return response.data.screens;
  }

  /*
    Sometimes API returns:
    {
      data: {
        screen: [...]
      }
    }
  */

  if (Array.isArray(response?.screen)) {
    return response.screen;
  }

  if (Array.isArray(response?.data?.screen)) {
    return response.data.screen;
  }

  return [];
};


/*
=====================================================
GET SCREEN LAYOUT
=====================================================
*/

export const getScreenLayout = (screen) => {
  if (!screen) {
    return [];
  }

  /*
    Try all common layout names
  */

  let layout =
    screen?.layout ??
    screen?.seatLayout ??
    screen?.seat_layout ??
    screen?.sections ??
    screen?.seatSections ??
    screen?.seat_sections ??
    screen?.seats ??
    [];

  /*
    JSON string support
  */

  if (typeof layout === "string") {
    try {
      layout = JSON.parse(layout);
    } catch (error) {
      console.error(
        "Unable to parse screen layout:",
        error
      );

      return [];
    }
  }

  /*
    Sometimes layout is inside object
  */

  if (!Array.isArray(layout) && layout?.sections) {
    layout = layout.sections;
  }

  if (!Array.isArray(layout) && layout?.rows) {
    layout = [
      {
        name: "Classic",
        rows: layout.rows,
      },
    ];
  }

  return Array.isArray(layout) ? layout : [];
};


/*
=====================================================
GET SECTION NAME
=====================================================
*/

export const getSectionName = (section) => {
  if (!section) {
    return "Seat";
  }

  return (
    section?.type ||
    section?.name ||
    section?.category ||
    section?.class ||
    section?.sectionName ||
    section?.section ||
    "Seat"
  );
};


/*
=====================================================
GET SECTION PRICE
=====================================================
*/

export const getSectionPrice = (section) => {
  if (!section) {
    return 0;
  }

  const price =
    section?.price ??
    section?.amount ??
    section?.seatPrice ??
    section?.ticketPrice ??
    section?.cost ??
    section?.rate ??
    section?.fare ??
    0;

  const numericPrice = Number(price);

  return Number.isFinite(numericPrice)
    ? numericPrice
    : 0;
};


/*
=====================================================
GET ROWS FROM SECTION
=====================================================
*/

export const getSectionRows = (section) => {
  if (!section) {
    return [];
  }

  /*
    Direct rows
  */

  if (Array.isArray(section?.rows)) {
    return section.rows;
  }

  /*
    Direct seats
  */

  if (Array.isArray(section?.seats)) {
    return section.seats;
  }

  /*
    Other possible API names
  */

  if (Array.isArray(section?.seatRows)) {
    return section.seatRows;
  }

  if (Array.isArray(section?.seat_rows)) {
    return section.seat_rows;
  }

  if (Array.isArray(section?.layout)) {
    return section.layout;
  }

  /*
    Nested:
    section.data.rows
  */

  if (Array.isArray(section?.data?.rows)) {
    return section.data.rows;
  }

  /*
    Nested:
    section.data.seats
  */

  if (Array.isArray(section?.data?.seats)) {
    return section.data.seats;
  }

  /*
    Nested:
    section.layout.rows
  */

  if (Array.isArray(section?.layout?.rows)) {
    return section.layout.rows;
  }

  /*
    Sometimes seats are inside:
    section.seatLayout
  */

  if (Array.isArray(section?.seatLayout)) {
    return section.seatLayout;
  }

  if (Array.isArray(section?.seatLayout?.rows)) {
    return section.seatLayout.rows;
  }

  return [];
};


/*
=====================================================
CONVERT ROW INTO SEATS
=====================================================
*/

export const getSeatsFromRow = (
  row,
  rowIndex = 0
) => {

  /*
    CASE 1
    Row itself is an array
  */

  if (Array.isArray(row)) {
    return row.map((seat, index) =>
      normalizeSeat(
        seat,
        rowIndex,
        index
      )
    );
  }


  /*
    CASE 2
    row.seats
  */

  if (Array.isArray(row?.seats)) {
    return row.seats.map(
      (seat, index) =>
        normalizeSeat(
          seat,
          rowIndex,
          index
        )
    );
  }


  /*
    CASE 3
    row.seat
  */

  if (Array.isArray(row?.seat)) {
    return row.seat.map(
      (seat, index) =>
        normalizeSeat(
          seat,
          rowIndex,
          index
        )
    );
  }


  /*
    CASE 4
    row.layout
  */

  if (Array.isArray(row?.layout)) {
    return row.layout.map(
      (seat, index) =>
        normalizeSeat(
          seat,
          rowIndex,
          index
        )
    );
  }


  /*
    CASE 5
    row.children
  */

  if (Array.isArray(row?.children)) {
    return row.children.map(
      (seat, index) =>
        normalizeSeat(
          seat,
          rowIndex,
          index
        )
    );
  }


  /*
    CASE 6
    Row contains seat count
  */

  const seatCount = Number(
    row?.seatCount ??
    row?.count ??
    row?.numberOfSeats ??
    row?.totalSeats ??
    0
  ) || 0;


  if (seatCount > 0) {
    return Array.from(
      { length: seatCount },
      (_, index) =>
        normalizeSeat(
          {
            seatNumber: index + 1,
          },
          rowIndex,
          index
        )
    );
  }


  /*
    CASE 7
    Row itself contains seat-like fields
  */

  if (
    row?.seatNumber !== undefined ||
    row?.seatNo !== undefined ||
    row?.number !== undefined ||
    row?.label !== undefined
  ) {
    return [
      normalizeSeat(
        row,
        rowIndex,
        0
      ),
    ];
  }


  return [];
};


/*
=====================================================
NORMALIZE INDIVIDUAL SEAT
=====================================================
*/

export const normalizeSeat = (
  seat,
  rowIndex = 0,
  seatIndex = 0
) => {

  /*
    STRING SEAT
  */

  if (typeof seat === "string") {
    return {
      id: seat,
      label: seat,
      number: seatIndex + 1,
      available: true,
    };
  }


  /*
    NULL / INVALID SEAT
  */

  if (!seat || typeof seat !== "object") {
    const rowName =
      String.fromCharCode(
        65 + rowIndex
      );

    const number =
      seatIndex + 1;

    return {
      id: `${rowName}-${number}`,
      label: `${rowName}${number}`,
      number,
      available: true,
    };
  }


  /*
    ROW NAME
  */

  const rowName =
    seat?.row ||
    seat?.rowName ||
    seat?.row_name ||
    String.fromCharCode(
      65 + rowIndex
    );


  /*
    SEAT NUMBER
  */

  const number =
    seat?.number ??
    seat?.seatNumber ??
    seat?.seatNo ??
    seat?.seat_number ??
    seatIndex + 1;


  /*
    AVAILABILITY
  */

  let available = true;

  if (
    seat?.available !== undefined
  ) {
    available =
      Boolean(seat.available);
  } else if (
    seat?.isAvailable !== undefined
  ) {
    available =
      Boolean(seat.isAvailable);
  } else if (
    seat?.status !== undefined
  ) {
    available =
      String(seat.status).toUpperCase() !==
      "BOOKED";
  }


  /*
    RETURN NORMALIZED SEAT
  */

  return {
    ...seat,

    id:
      seat?.id ||
      seat?._id ||
      seat?.seatId ||
      `${rowName}-${number}`,

    label:
      seat?.label ||
      seat?.name ||
      seat?.seatLabel ||
      `${rowName}${number}`,

    number,

    available,
  };
};