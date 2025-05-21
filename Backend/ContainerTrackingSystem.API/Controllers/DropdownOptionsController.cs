using ContainerTrackingSystem.Core.Interfaces;
using ContainerTrackingSystem.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ContainerTrackingSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DropdownOptionsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public DropdownOptionsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/DropdownOptions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DropdownOption>>> GetDropdownOptions()
        {
            var options = await _unitOfWork.DropdownOptions.Query()
                .OrderBy(o => o.Category)
                .ThenBy(o => o.SortOrder)
                .ToListAsync();
                
            return Ok(options);
        }

        // GET: api/DropdownOptions/category/ContainerStatus
        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<DropdownOption>>> GetDropdownOptionsByCategory(string category)
        {
            var options = await _unitOfWork.DropdownOptions.Query()
                .Where(o => o.Category == category && o.IsActive)
                .OrderBy(o => o.SortOrder)
                .ToListAsync();

            return Ok(options);
        }

        // GET: api/DropdownOptions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DropdownOption>> GetDropdownOption(int id)
        {
            var option = await _unitOfWork.DropdownOptions.GetByIdAsync(id);

            if (option == null)
            {
                return NotFound();
            }

            return option;
        }

        // PUT: api/DropdownOptions/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDropdownOption(int id, DropdownOption option)
        {
            if (id != option.Id)
            {
                return BadRequest();
            }

            _unitOfWork.DropdownOptions.Update(option);

            try
            {
                await _unitOfWork.CompleteAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await DropdownOptionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/DropdownOptions
        [HttpPost]
        public async Task<ActionResult<DropdownOption>> PostDropdownOption(DropdownOption option)
        {
            await _unitOfWork.DropdownOptions.AddAsync(option);
            await _unitOfWork.CompleteAsync();

            return CreatedAtAction("GetDropdownOption", new { id = option.Id }, option);
        }

        // DELETE: api/DropdownOptions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDropdownOption(int id)
        {
            var option = await _unitOfWork.DropdownOptions.GetByIdAsync(id);
            if (option == null)
            {
                return NotFound();
            }

            _unitOfWork.DropdownOptions.Remove(option);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        private async Task<bool> DropdownOptionExists(int id)
        {
            return await _unitOfWork.DropdownOptions.AnyAsync(e => e.Id == id);
        }
    }
}
