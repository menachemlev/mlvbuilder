const Websites = require('../models/WebsitesModel');
const AppError = require('../util/appError');
const catchAsync = require('./../util/catchAsync');

function addHeaderAndEnderHTML(
  htmlcode,
  heightToWidthRatioLandspace,
  heightToWidthRatioPortrait
) {
  const htmlHeader = `<!DOCTYPE html>
<html>
<head>
<title>Preview</title>
<meta

name="viewport"

content="width=device-width,height=device-height,minimum-scale=1,maximum-scale=1, initial-scale=1"
/>
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200&display=swap');
body{
  font-size:120%;
  font-family: "Poppins", sans-serif;
}
svg{
  display:none;
}
*{
font-family:inherit;
}
button:hover{
  filter:brightness(0.85);
}
button{
  font-size:140%;
}
@media screen and (max-width: 64em) {
  .landspace{
    font-size:110%;
  }
  .portrait{
    font-size:230%;
  }

}
</style></head><body>`;
  const htmlEnder = `<script>const checkIfLandspaceAndUpdate = () => {
    document.querySelectorAll(".portrait").forEach((div) => {
      div.style.height = "${heightToWidthRatioPortrait * 100}vw";
      div.style.width = "100vw";

    });
    document.querySelectorAll(".landspace").forEach((div) => {
      div.style.height = "${heightToWidthRatioLandspace * 100}vw";
      div.style.width = "100vw";

    });
  if (window.innerHeight > window.innerWidth) {
    document.querySelectorAll(".portrait").forEach((div) => {
      div.style.display = "block";
    });
    document.querySelectorAll(".landspace").forEach((div) => {
      div.style.display = "none";
    });
  } else {
    document.querySelectorAll(".portrait").forEach((div) => {
      div.style.display = "none";
    });
    document.querySelectorAll(".landspace").forEach((div) => {
      div.style.display = "block";
    });
  }
};
checkIfLandspaceAndUpdate();
setInterval(checkIfLandspaceAndUpdate, 1000);
window.addEventListener("orientationchange", checkIfLandspaceAndUpdate);</script></body></html>`;
  return `${htmlHeader}${htmlcode}${htmlEnder}`;
}

exports.createWebsite = catchAsync(async (req, res, next) => {
  const {
    email,
    previewElements,
    html,
    public,
    height,
    heightToWidthRatioLandspace,
    heightToWidthRatioPortrait,
  } = req.body;

  const html_new = public
    ? addHeaderAndEnderHTML(
        html.replace(/none/g, '').replace(/block/g, ''),
        heightToWidthRatioLandspace,
        heightToWidthRatioPortrait
      )
    : '<h1>Being built...</h1>';
  const website = await Websites.create({
    html: html_new,
    email,
    previewElements,
    height,
  });
  if (!website) {
    return next(new AppError('could not create website', 404));
  }
  const id = website.id;
  res.status(201).json({
    status: 'success',
    id,
    data: {
      website,
    },
  });
});
exports.updateWebsite = catchAsync(async (req, res, next) => {
  const {
    email,
    previewElements,
    public,
    html,
    height,
    heightToWidthRatioLandspace,
    heightToWidthRatioPortrait,
  } = req.body;
  const id = req.params.id;
  const original = await Websites.findById(id);
  if (!original) {
    return next(new AppError('Website not found', 404));
  }
  if (original.email !== email) {
    return next(new AppError('Could not update website'));
  }

  const html_new = `${
    public
      ? addHeaderAndEnderHTML(
          html.replace(/none/g, '').replace(/block/g, ''),
          heightToWidthRatioLandspace,
          heightToWidthRatioPortrait
        )
      : original.html
  }`;
  const website = await Websites.findByIdAndUpdate(
    id,
    {
      email,
      html: html_new,
      previewElements,
      height,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(202).json({
    status: 'success',
    id,
    data: {
      website,
    },
  });
});
exports.deleteMyWebsite = catchAsync(async (req, res, next) => {
  const website = await Websites.findById(req.params.id);
  if (!website) {
    return next(new AppError('Website not found', 404));
  }
  if (website.email !== req.body.email) {
    return next(new AppError('Could not delete website', 403));
  }
  website.active = false;
  website.email = `deleted - ${website.email}`;
  await website.save({ validatorBeforeSave: false });
  res.status(203).json({
    status: 'success',
    data: null,
  });
});

exports.getWebsitesList = catchAsync(async (req, res, next) => {
  const websitesList = await Websites.aggregate([
    {
      $match: {
        email: req.body.email,
      },
    },
  ]);
  if (typeof websitesList === undefined) {
    return next(new AppError('Could not look for websites', 500));
  }
  res.status(200).json({
    status: 'success',
    data: { websitesList },
  });
});

exports.getWebsite = catchAsync(async (req, res, next) => {
  const website = await Websites.findById(req.params.id);
  if (!website) {
    return next(new AppError('Website not found', 404));
  }
  const html = `${website.html.replace(/&lt;/g, '<').replace(/\n/g, '')}`;
  res.status(200).send(html);
});

exports.getPreviewElements = catchAsync(async (req, res, next) => {
  const previewElements = await Websites.findById(
    req.params.id,
    'previewElements height'
  );
  if (!previewElements) {
    return next(new AppError('Website not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      previewElements,
    },
  });
});
