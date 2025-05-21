import {
  getShiplineTrackingUrl,
  getVesselLineTrackingUrl,
  getTerminalTrackingUrl,
} from '../linkGenerator';
import { mockContainer, mockShiplines, mockVesselLines, mockTerminals } from '../../__tests__/utils/mockData';

describe('linkGenerator', () => {
  describe('getShiplineTrackingUrl', () => {
    it('should return null when shipline has no link', () => {
      const shiplineWithoutLink = { ...mockShiplines[0], link: undefined };
      
      const result = getShiplineTrackingUrl(shiplineWithoutLink, mockContainer);
      
      expect(result).toBe(null);
    });

    it('should return static link when isDynamicLink is false', () => {
      const staticShipline = { ...mockShiplines[0], isDynamicLink: false };
      
      const result = getShiplineTrackingUrl(staticShipline, mockContainer);
      
      expect(result).toBe(staticShipline.link);
    });

    it('should replace variables in dynamic link', () => {
      const dynamicShipline = {
        ...mockShiplines[0],
        link: 'https://example.com/track?container={containerNumber}&bol={bolNumber}',
        isDynamicLink: true,
      };
      
      const result = getShiplineTrackingUrl(dynamicShipline, mockContainer);
      
      expect(result).toBe(`https://example.com/track?container=${mockContainer.ContainerNumber}&bol=${mockContainer.BOLBookingNumber}`);
    });

    it('should handle missing container properties in dynamic link', () => {
      const containerWithMissingProps = { ...mockContainer, BOLBookingNumber: undefined };
      const dynamicShipline = {
        ...mockShiplines[0],
        link: 'https://example.com/track?container={containerNumber}&bol={bolNumber}',
        isDynamicLink: true,
      };
      
      const result = getShiplineTrackingUrl(dynamicShipline, containerWithMissingProps);
      
      expect(result).toBe(`https://example.com/track?container=${mockContainer.ContainerNumber}&bol=`);
    });

    it('should replace vessel-related variables', () => {
      const dynamicShipline = {
        ...mockShiplines[0],
        link: 'https://example.com/track?vessel={vesselName}&imo={vesselImo}&mmsi={vesselMmsi}',
        isDynamicLink: true,
      };
      
      const result = getShiplineTrackingUrl(dynamicShipline, mockContainer);
      
      expect(result).toBe(`https://example.com/track?vessel=${mockContainer.Vessel?.vesselName}&imo=${mockContainer.Vessel?.imo}&mmsi=${mockContainer.Vessel?.mmsi}`);
    });

    it('should handle missing vessel information', () => {
      const containerWithoutVessel = { ...mockContainer, Vessel: undefined };
      const dynamicShipline = {
        ...mockShiplines[0],
        link: 'https://example.com/track?vessel={vesselName}',
        isDynamicLink: true,
      };
      
      const result = getShiplineTrackingUrl(dynamicShipline, containerWithoutVessel);
      
      expect(result).toBe('https://example.com/track?vessel=');
    });
  });

  describe('getVesselLineTrackingUrl', () => {
    it('should return null when vessel line has no link', () => {
      const vesselLineWithoutLink = { ...mockVesselLines[0], link: undefined };
      
      const result = getVesselLineTrackingUrl(vesselLineWithoutLink, mockContainer);
      
      expect(result).toBe(null);
    });

    it('should return static link when isDynamicLink is false', () => {
      const staticVesselLine = { ...mockVesselLines[0], isDynamicLink: false };
      
      const result = getVesselLineTrackingUrl(staticVesselLine, mockContainer);
      
      expect(result).toBe(staticVesselLine.link);
    });

    it('should replace variables in dynamic link', () => {
      const dynamicVesselLine = {
        ...mockVesselLines[0],
        link: 'https://example.com/track?container={containerNumber}&voyage={voyage}',
        isDynamicLink: true,
      };
      
      const result = getVesselLineTrackingUrl(dynamicVesselLine, mockContainer);
      
      expect(result).toBe(`https://example.com/track?container=${mockContainer.ContainerNumber}&voyage=${mockContainer.Voyage}`);
    });
  });

  describe('getTerminalTrackingUrl', () => {
    it('should return null when terminal has no link', () => {
      const terminalWithoutLink = { ...mockTerminals[0], link: undefined };
      
      const result = getTerminalTrackingUrl(terminalWithoutLink, mockContainer);
      
      expect(result).toBe(null);
    });

    it('should return terminal link when available', () => {
      const result = getTerminalTrackingUrl(mockTerminals[0], mockContainer);
      
      expect(result).toBe(mockTerminals[0].link);
    });

    it('should handle terminal without link property', () => {
      const terminalWithoutLink = { ...mockTerminals[1] }; // This one doesn't have a link in mock data
      
      const result = getTerminalTrackingUrl(terminalWithoutLink, mockContainer);
      
      expect(result).toBe(null);
    });
  });

  describe('Variable replacement edge cases', () => {
    it('should handle all supported variable types', () => {
      const shiplineWithAllVariables = {
        ...mockShiplines[0],
        link: 'https://example.com/track?container={containerNumber}&bol={bolNumber}&voyage={voyage}&vessel={vesselName}&imo={vesselImo}&mmsi={vesselMmsi}',
        isDynamicLink: true,
      };
      
      const result = getShiplineTrackingUrl(shiplineWithAllVariables, mockContainer);
      
      expect(result).toContain(`container=${mockContainer.ContainerNumber}`);
      expect(result).toContain(`bol=${mockContainer.BOLBookingNumber}`);
      expect(result).toContain(`voyage=${mockContainer.Voyage}`);
      expect(result).toContain(`vessel=${mockContainer.Vessel?.vesselName}`);
      expect(result).toContain(`imo=${mockContainer.Vessel?.imo}`);
      expect(result).toContain(`mmsi=${mockContainer.Vessel?.mmsi}`);
    });

    it('should not replace non-existent variables', () => {
      const shiplineWithUnknownVariable = {
        ...mockShiplines[0],
        link: 'https://example.com/track?unknown={unknownVariable}',
        isDynamicLink: true,
      };
      
      const result = getShiplineTrackingUrl(shiplineWithUnknownVariable, mockContainer);
      
      expect(result).toBe('https://example.com/track?unknown={unknownVariable}');
    });

    it('should handle empty string values', () => {
      const containerWithEmptyValues = {
        ...mockContainer,
        ContainerNumber: '',
        BOLBookingNumber: '',
        Voyage: '',
      };
      
      const shiplineWithVariables = {
        ...mockShiplines[0],
        link: 'https://example.com/track?container={containerNumber}&bol={bolNumber}&voyage={voyage}',
        isDynamicLink: true,
      };
      
      const result = getShiplineTrackingUrl(shiplineWithVariables, containerWithEmptyValues);
      
      expect(result).toBe('https://example.com/track?container=&bol=&voyage=');
    });
  });
});