var images = []
var bucket = ""
var prefix = ""
var currentIndex = 0
var currentRotation = 0

function imageUrl(imageType, imageName) {
    return 'http://s3.amazonaws.com/' + bucket + '/' + prefix + '/' + imageType
    + '/' + imageName
}

function photos(region, theBucket) {
    var uri = window.document.documentURI
    var position = uri.search(theBucket)
    prefix = uri.substring(position+theBucket.length+1, uri.length-1)
    bucket = theBucket;
    document.getElementById("main").style.display = 'none'
    var thumbDiv = document.getElementById("thumbs")
    AWS.config.update({ region: region });
    var s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: { Bucket: bucket }
    });
    s3.makeUnauthenticatedRequest(
        'listObjectsV2',
        {Bucket: theBucket, Prefix: prefix + '/thumb'},
        function(err, s3data) {
            if (err) console.log(err, err.stack)
            else {
                var i, len = s3data.Contents.length
                for (i=0; i<len; ++i) {
                    var parts = s3data.Contents[i].Key.split('/')
                    addThumb(thumbDiv, parts.pop(), bucket, prefix, i)
                }
            }
        }
    )
}


function addThumb(thumbDiv, thumbName, bucket, prefix, index) {
    images.push(thumbName)
    var img = document.createElement("img")
    var anchor = document.createElement("a")
    img.src = imageUrl('thumb', thumbName)
    var anchor = document.createElement("a")
    anchor.onclick = function () { return clickOnThumb(index) }
    anchor.appendChild(img)
    thumbDiv.appendChild(anchor)
}

function displayImage() {
    currentRotation = 0
    var img = document.createElement("img")
    img.src = imageUrl('main', images[currentIndex])
    img.id = "main-image"
    img.onload = function() {
        var hscale = img.height/parseFloat(window.innerHeight)
        var wscale = img.width/parseFloat(window.innerWidth)
        if (hscale > 1 || wscale > 1) {
            var scale = 1.1*(hscale > wscale ? hscale : wscale)
            img.height = Math.round(img.height/scale)
        }
    }
    var container = document.getElementById("image-container")
    if (container.firstChild) 
        container.replaceChild(img, container.firstChild)
    else
        container.appendChild(img)
    document.getElementById("thumbs").style.display = 'none'
    document.getElementById("main").style.display = 'inline'
}


function clickOnThumb(index) {
    currentIndex = index % images.length
    displayImage()
    return false
} 

function previous() {
    currentIndex = (images.length + currentIndex -1) % images.length
    displayImage()
    return false
}

function next() {
    currentIndex = (currentIndex +1) % images.length
    displayImage()
    return false
}

function closeImage() {
    document.getElementById("thumbs").style.display = 'inline'
    document.getElementById("main").style.display = 'none'
    return false
}

function rotate(n) {
    currentRotation += n
    var rotation = 'rotate(' + currentRotation + 'deg)'
    document.getElementById("main-image").style.transform = rotation
    return false
}
