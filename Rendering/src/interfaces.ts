interface IDomSectionElements {
    SELF: HTMLElement,
    CANVAS: HTMLCanvasElement,
    DS_FACTOR_SELECT: HTMLSelectElement,
    EXEC_TIME_UI: HTMLElement,
    CELLS_DREW_UI: HTMLElement,
    REFRESH_BTN: HTMLButtonElement
}

interface IDomSections {
    SECTION2D_LINE: IDomSectionElements,
    SECTION2D_RECT: IDomSectionElements,
    SECTION_IMAGEDATA: IDomSectionElements,
    SECTIONWEBGL_PIXI: IDomSectionElements,
}

export {IDomSectionElements, IDomSections}