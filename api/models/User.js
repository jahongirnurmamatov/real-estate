import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        default:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKIAAACUCAMAAAAnDwKZAAAAMFBMVEXk5ueutLenrrHn6eqrsbWxt7rZ3N3e4eLJzc+/xMbS1dfGysy2u765vsHO0dPq7O2qiZVgAAADy0lEQVR4nO2cWa7dIAxACQYSIMP+d1vITe88YDsxeRLn46mtKvXI2MQQp0o1Go1Go9FoNBqNRqPRaLwHIP9Q/3+cjaTXhzn6TByC6+FkmgAuTrYzV+w4DWo5jWWK39Dp7hmjx3CSFYfed+ZFcEVP8ykk4yfBHEljXW1HcPaz4CWSvq8qCfG73xrJsWog/WuVvJMM1QT76cciXxd7rhVHWyaY4zhUcezHYsMUxyqOE8Iw56O4I5RVyh3SdQ2hsFJuYbSyhqovL5WrYxQNI5RuNw+OkukIDpuIK5OcoVKY/eaGlgsjzIRlzli5laZkYkYsG4mZmJHKxoUaxIQTcqQbmigiSC6WjEzBgGco6l5CEdWEPSPTODqGYarp5XhDfI/zgEi/E1mKEtsOq1o6kc4WONWSkDgM4pvZe0RKmhdEkd6bl4pN8c8osgxlFHmbjkRFk86nd0icDc7/dFEDr40QaBi5nY5Iv8h6AnqBfhF7sfiIzEkaPENR5uzCSsZJ5joC6IZmEDFUC2NnlLqN6MmKXuxqjBpGI3YlD4EYRMH7ReIp0EhlYqan3DAaL2iogHLel+gg7iDcPUm/TgX05ZMRerDcOc7IdByFBRW6qkWr+QrKsc58BCaO8m+jN0oddb0ZEyg6apmx5qQOhF+TROssUT3B7AgfB8a2ENpqaXiTDNPnHdJ0se441uaogn0vabSvshu+ARbnR2MeFjz9bhxOMRm4AdCHYeq0XkdAtdbWz+5MgiurjwvzMM/hLMv7DCSWC/mXtXUeyGLQpwDGy0ByHkme80xy/vPqcqCS2uBtTj9zK5gtIbWd8vi0qhZSABfiWsnfZmm1sVOcK0x5p3/QxXHdWgpIf8lGJxnMvMP4TuMOWEZ3PjgZy7xP27LovQTT+nB8AcHbQfhydDcf2/dAH383X79imdLysEh+mdTHSXYHdZDgIrJCvkgav38kAQb2Ej9I2r3fBULYZYkfJHedmU9Vwqnij5L7fSDx+2sMquNO5xpQh4Rwk/Q79L1AHvksc5zYi33YIl8duVf05It3jCQrISUMkyPj+pY174mAfsXMfDmOgBpHmVXeHEn5iL9wZzlS6hoO3m2eoLyUOXTHfsWgB+fL7l93dcR2Z/RXznRw6cidRqWAW2qY5Q2RuyPh46890IggitfKBUTFwHE97HeKN8daQcSM8VQo543CN8KS7cMzpZ/hMb9z4GAKvzWpt87JsciQNOCym2LJSkudBj5QsjUunAlKPiUP6qWqYTeW7N5V17noAePqKhYMYULQdan3P3U0Go3GH+EfReUvYx8xj5gAAAAASUVORK5CYII='
    }
},{timestamps:true});

const User = mongoose.model('User',userSchema);

export default User;