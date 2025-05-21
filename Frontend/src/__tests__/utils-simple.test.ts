// Simple utility tests without external dependencies

describe('Simple Utils', () => {
  it('should test basic array operations', () => {
    const testArray = [1, 2, 3];
    expect(testArray.length).toBe(3);
    expect(testArray.includes(2)).toBe(true);
  });

  it('should test basic string operations', () => {
    const containerNumber = 'CAAU5462320';
    expect(containerNumber.toLowerCase()).toBe('caau5462320');
    expect(containerNumber.includes('CAAU')).toBe(true);
  });

  it('should test basic object operations', () => {
    const container = {
      ContainerID: 1,
      ContainerNumber: 'TEST123',
      CurrentStatus: 'At Port'
    };
    
    expect(container.ContainerID).toBe(1);
    expect(container.ContainerNumber).toBe('TEST123');
    expect(typeof container.CurrentStatus).toBe('string');
  });

  it('should test basic filtering logic', () => {
    const containers = [
      { ContainerID: 1, CurrentStatus: 'At Port' },
      { ContainerID: 2, CurrentStatus: 'On Vessel' },
      { ContainerID: 3, CurrentStatus: 'At Port' }
    ];

    const filtered = containers.filter(c => c.CurrentStatus === 'At Port');
    expect(filtered).toHaveLength(2);
    expect(filtered[0].ContainerID).toBe(1);
    expect(filtered[1].ContainerID).toBe(3);
  });
});