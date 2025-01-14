import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { CareViewSummary } from "../components/CareViewSummary";
import { mockWardList } from "./CareViewSummaryMock";
import { CareViewContext } from "../../../context/CareViewContext";
import { WARD_SUMMARY_HEADER } from "../../../constants";

const mockGetSelectedWard = jest.fn();
const mockGetWardOptions = jest.fn();
const mockGetWardSummary = jest.fn();
const mockGetSliderPerView = jest.fn();
const mockContext = {
  selectedWard: { label: "ward", uuid: "uuid" },
  setSelectedWard: jest.fn,
  wardSummary: {
    totalPatients: 27,
    totalProviderPatients: 5,
  },
  setWardSummary: jest.fn,
  headerSelected: WARD_SUMMARY_HEADER.TOTAL_PATIENTS,
  setHeaderSelected: jest.fn(),
  provider: { uuid: "provider-uuid" },
};

jest.mock("swiper/react", () => ({
  Swiper: ({ children }) => children,
  SwiperSlide: ({ children }) => children,
}));
jest.mock("swiper/modules", () => ({
  Pagination: (props) => [props],
}));
jest.mock("swiper/css", () => jest.fn());
jest.mock("swiper/css/pagination", () => jest.fn());

jest.mock("../utils/CareViewSummary", () => {
  return {
    getSelectedWard: () => mockGetSelectedWard(),
    getWardOptions: () => mockGetWardOptions(),
    getWardSummary: () => mockGetWardSummary(),
    getSlidesPerView: () => mockGetSliderPerView(),
  };
});

describe("CareViewSummary", function () {
  it("should render Dropdown and summary tiles", () => {
    mockGetWardOptions.mockReturnValue(mockWardList);
    mockGetWardSummary.mockReturnValue({
      totalPatients: 27,
    });
    const { container } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewSummary callbacks={{ setIsLoading: jest.fn }} />
      </CareViewContext.Provider>
    );
    expect(container.querySelector(".bx--list-box__wrapper")).toBeTruthy();
    expect(container.querySelectorAll(".summary-tile")).toBeTruthy();
    expect(container.querySelectorAll(".summary-tile").length).toEqual(2);
  });

  it("should display the total patient count", () => {
    mockGetWardOptions.mockReturnValue(mockWardList);
    mockGetWardSummary.mockReturnValue({
      totalPatients: 27,
    });
    const { getByText } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewSummary callbacks={{ setIsLoading: jest.fn }} />
      </CareViewContext.Provider>
    );
    expect(getByText("27")).toBeTruthy();
  });

  it("should display the my patient count", () => {
    mockGetWardOptions.mockReturnValue(mockWardList);
    const { getByText } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewSummary callbacks={{ setIsLoading: jest.fn }} />
      </CareViewContext.Provider>
    );
    expect(getByText("5")).toBeTruthy();
  });

  it("should select total patients tile by default", async () => {
    mockGetWardOptions.mockReturnValue(mockWardList);
    mockGetWardSummary.mockReturnValue({
      totalPatients: 27,
    });
    const { container } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewSummary callbacks={{ setIsLoading: jest.fn }} />
      </CareViewContext.Provider>
    );

    const activeTiles = container.querySelectorAll(".bx--tile.summary-tile");
    expect(activeTiles).toBeTruthy();

    activeTiles.forEach((div, index) => {
      expect(div).toBeTruthy();
      expect(div.classList.contains("selected-header")).toBe(index === 0);
    });
    expect(mockContext.setHeaderSelected).toHaveBeenCalledTimes(0);
  });

  it("should set my patients when the my patients tile is clicked", async () => {
    mockGetWardOptions.mockReturnValue(mockWardList);
    mockGetWardSummary.mockReturnValue({
      totalPatients: 27,
    });
    const { container } = render(
      <CareViewContext.Provider value={mockContext}>
        <CareViewSummary callbacks={{ setIsLoading: jest.fn }} />
      </CareViewContext.Provider>
    );

    await waitFor(() => {
      const activeTiles = container.querySelectorAll(".bx--tile.summary-tile");
      expect(activeTiles).toBeTruthy();
      expect(mockContext.setHeaderSelected).toHaveBeenCalledTimes(0);
      const myPatientsTile = activeTiles[1];
      fireEvent.click(myPatientsTile);
      expect(mockContext.setHeaderSelected).toHaveBeenCalledWith(
        WARD_SUMMARY_HEADER.MY_PATIENTS
      );
    });
  });
});
