using ContainerTrackingSystem.Core.Interfaces;
using ContainerTrackingSystem.Core.Models;
using ContainerTrackingSystem.Data.Repositories;
using System;
using System.Threading.Tasks;

namespace ContainerTrackingSystem.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private Repository<Container> _containers;
        private Repository<Port> _ports;
        private Repository<Terminal> _terminals;
        private Repository<Shipline> _shiplines;
        private Repository<VesselLine> _vesselLines;
        private Repository<Vessel> _vessels;
        private Repository<Fpm> _fpms;
        private Repository<DropdownOption> _dropdownOptions;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }

        public IRepository<Container> Containers => _containers ??= new Repository<Container>(_context);
        public IRepository<Port> Ports => _ports ??= new Repository<Port>(_context);
        public IRepository<Terminal> Terminals => _terminals ??= new Repository<Terminal>(_context);
        public IRepository<Shipline> Shiplines => _shiplines ??= new Repository<Shipline>(_context);
        public IRepository<VesselLine> VesselLines => _vesselLines ??= new Repository<VesselLine>(_context);
        public IRepository<Vessel> Vessels => _vessels ??= new Repository<Vessel>(_context);
        public IRepository<Fpm> Fpms => _fpms ??= new Repository<Fpm>(_context);
        public IRepository<DropdownOption> DropdownOptions => _dropdownOptions ??= new Repository<DropdownOption>(_context);

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
