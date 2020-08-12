using System;
using System.IO;
using System.Net.Http.Headers;
using api.Models;
using api.Services.Draw;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{


    [ApiController, Route("[controller]")]
    public class DrawController : ControllerBase
    {
        private readonly IDrawService _drawService;
        public DrawController(IDrawService drawService)
        {
            _drawService = drawService;
        }

        [HttpPost("images/upload"), DisableRequestSizeLimit]
        public IActionResult Upload()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("wwwroot", "Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error. :[ {ex}");
            }
        }

        [HttpGet("images/{imageUrl}")]
        public IActionResult Get(string imageUrl)
        {
            if (imageUrl == null)
            {
                return BadRequest(new { imageUrl });
            }
            try
            {
                Console.WriteLine($"url of image we fetching = {imageUrl}");

                string folderName;
                if (imageUrl.Contains("_placeholder"))
                {
                    folderName = Path.Combine("wwwroot", "Resources", "Placeholders");
                }
                else
                {
                    folderName = Path.Combine("wwwroot", "Resources", "Images");
                }
                var pathToGet = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                var fullPath = Path.Combine(pathToGet, imageUrl);
                Byte[] b = System.IO.File.ReadAllBytes(fullPath);
                return File(b, "image/png");

            }
            catch (Exception ex)
            {
                Console.WriteLine("Image not available" + ex);
                return BadRequest("image was not fetched");
            }
        }



        [HttpPost("images/copy")]
        public IActionResult Post(api.Dtos.ImageTransferDto body)
        {
            try
            {
                var folderName = Path.Combine("wwwroot", "Resources", "Placeholders");
                var pathToGet = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                var fullPath = Path.Combine(pathToGet, body.originalUrl);

                string newImageUrl = body.newImageUrl;
                System.IO.File.Copy(fullPath, $"wwwroot/Resources/Images/{ newImageUrl }");
                return Ok(new { newImageUrl });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Image not available" + ex);
                return BadRequest("image was not fetched");
            }
        }

        [HttpPost("images/prompts/upload"), DisableRequestSizeLimit]
        public IActionResult PromptImgUpload()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("wwwroot", "Resources", "PromptImgs");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error. :[ {ex}");
            }
        }

        [HttpGet("images/prompts/{imageUrl}")]
        public IActionResult GetPromptImg(string imageUrl)
        {
            try
            {
                var folderName = Path.Combine("wwwroot", "Resources", "PromptImgs");
                var pathToGet = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                var fullPath = Path.Combine(pathToGet, imageUrl);
                Byte[] b = System.IO.File.ReadAllBytes(fullPath);
                return File(b, "image/png");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Image not available" + ex);
                return BadRequest("image was not fetched");
            }
        }
    }
}