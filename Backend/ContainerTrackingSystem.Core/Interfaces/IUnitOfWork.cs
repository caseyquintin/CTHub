using ContainerTrackingSystem.Core.Models;
using System;
using System.Threading.Tasks;

namespace ContainerTrackingSystem.Core.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<Container> Containers { get; }
        IRepository<Port> Ports { get; }
        IRepository<Terminal> Terminals { get; }
        IRepository<Shipline> Shiplines { get; }
        IRepository<VesselLine> VesselLines { get; }
        IRepository<Vessel> Vessels { get; }
        IRepository<Fpm> Fpms { get; }
        IRepository<DropdownOption> DropdownOptions { get; }

        Task<int> CompleteAsync();
    }
}
