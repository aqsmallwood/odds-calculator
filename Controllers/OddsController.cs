using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace odds_calculator.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class OddsController : Controller
    {
        private const string OddsRegularExpression = @"^([\+-])(\d\d\d+)$";

        private double CalculateOdds(int odds, bool favorite) => favorite ? odds / (100.0 + odds) : 100.0 / (100.0 + odds);

        // GET: /<controller>/
        [HttpGet]
        public IActionResult Index(string americanOdds)
        {
            var oddsMatcher = new Regex(OddsRegularExpression, RegexOptions.Compiled);

            MatchCollection matches = oddsMatcher.Matches(americanOdds);

            // Received string did not match American Odds Regular Expression
            if (matches.Count < 1)
            {
                return BadRequest("Invalid odds format");
            }

            GroupCollection capturedGroups = matches[0].Groups;

            // Regular expression ensures second group is a string of digits
            int.TryParse(capturedGroups[2].Value, out int oddsValue);

            // Regular expression ensures first group is a + or a -
            var favorite = capturedGroups[1].Value == "-";
            var calculatedOdds = Math.Round(CalculateOdds(oddsValue, favorite), 3);

            return Ok(calculatedOdds);
        }
    }
}
