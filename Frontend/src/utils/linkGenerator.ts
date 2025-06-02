import { Shipline, VesselLine, Terminal, Container } from '../types';

/**
 * Generates a tracking URL for a container based on the specified link template
 * 
 * @param linkTemplate The URL template with placeholders
 * @param container The container object containing data to substitute
 * @param isDynamic Whether the link template supports dynamic substitution
 * @returns Formatted URL with substituted values
 */
export const generateTrackingUrl = (
  linkTemplate: string | undefined,
  container: Container,
  isDynamic: boolean
): string => {
  if (!linkTemplate) return '';
  
  // If the link is not dynamic, return it as-is
  if (!isDynamic) return linkTemplate;
  
  // Define variables that can be replaced in the URL
  const variables: Record<string, string> = {
    '{containerNumber}': container.ContainerNumber || '',
    '{bolNumber}': container.BOLBookingNumber || '',
    '{voyage}': container.Voyage || '',
    '{vesselName}': container.Vessel?.vesselName || '',
    '{vesselImo}': container.Vessel?.imo || '',
    '{vesselMmsi}': container.Vessel?.mmsi || '',
  };
  
  // Replace variables in the URL
  let url = linkTemplate;
  Object.entries(variables).forEach(([placeholder, value]) => {
    url = url.replace(new RegExp(placeholder, 'g'), encodeURIComponent(value));
  });
  
  return url;
};

/**
 * Generates a shipline tracking URL
 */
export const getShiplineTrackingUrl = (shipline: Shipline | undefined, container: Container): string => {
  if (!shipline || !shipline.Link) return '';
  return generateTrackingUrl(shipline.Link, container, shipline.IsDynamicLink ?? false);
};

/**
 * Generates a vessel line tracking URL
 */
export const getVesselLineTrackingUrl = (vesselLine: VesselLine | undefined, container: Container): string => {
  if (!vesselLine) return '';
  return generateTrackingUrl(vesselLine.link, container, vesselLine.isDynamicLink);
};

/**
 * Generates a terminal tracking URL
 */
export const getTerminalTrackingUrl = (terminal: Terminal | undefined, container: Container): string => {
  if (!terminal || !terminal.link) return '';
  return generateTrackingUrl(terminal.link, container, true);
};