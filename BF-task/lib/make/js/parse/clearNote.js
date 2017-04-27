
function format_obj() {
    return {
        s_normal:           0,
        s_char:             1,
        s_char_conv:        2,
        s_string:           3,
        s_string_conv:      4,
        s_linecomment:      5,
        s_linecomment_conv: 6,
        s_comment1:         7,
        s_comment:          8,
        s_commented1:       9,
        s_conv:             10,
        s_eof:              11,


        g_state:            0,
        g_conv_state:       0,
        g_convlinecnt:      0,
        g_trigraph:         0,
        g_output_string:    "",

        g_trigraph_on:      1,

        put:
            function(c) {
                this.g_output_string += c;
            },
        init:
            function() {
                this.g_state = this.s_normal;
                this.g_conv_state = this.s_normal;
                this.g_trigraph = 0;
                this.g_output_string = ""
            },

        deal:
            function(c) {
                if (this.g_trigraph_on) {
                    if (c == '?') { // trigraph pre process
                        if (this.g_trigraph < 2) {
                            this.g_trigraph++;
                            return 0;
                        }
                    } else if (this.g_trigraph == 2 && c == '/') {
                        c = '\\';
                        this.g_trigraph = 0;
                    } else if (this.g_trigraph > 0) {
                        var t = this.g_trigraph;
                        this.g_trigraph = 2;
                        while (t--) this.deal('?');
                        this.g_trigraph = 0;
                    }
                }
                if (this.g_conv_state == this.s_conv) { // '\' at end of line
                    this.g_conv_state = this.s_normal;
                    if (c == '\n') {
                        ++this.g_convlinecnt;
                        return 0;
                    } else {
                        if (this.g_state == this.s_comment1) {
                            this.put('/');
                            while (this.g_convlinecnt) --this.g_convlinecnt, this.put("\\\n");
                            this.put('\\');
                            this.g_state = this.s_normal;
                        } else if (this.g_state == this.s_commented1) {
                            this.g_state = this.s_comment;
                        }
                    }
                } else if (c == '\\') {
                    if (this.g_state == this.s_comment1 || this.g_state == this.s_commented1) {
                        this.g_conv_state = this.s_conv;
                        return 0;
                    }
                }
                switch(this.g_state) {
                    case this.s_normal:
                        if (c == '\"') this.g_state = this.s_string, this.put(c);
                        else if (c == '\'') this.g_state = this.s_char, this.put(c);
                        else if (c == '/') this.g_state = this.s_comment1, this.g_convlinecnt = 0;
                        else if (c == 'EOF') this.g_state = this.s_eof;
                        else this.put(c);
                        break;
                    case this.s_char:
                        this.put(c);
                        if (c == '\'') this.g_state = this.s_normal;
                        else if (c == '\\') this.g_state = this.s_char_conv;
                        else if (c == 'EOF') this.g_state = this.s_eof;
                        break;
                    case this.s_char_conv:
                        this.put(c);
                        this.g_state = this.s_char;
                        break;
                    case this.s_string:
                        this.put(c);
                        if (c == '\"') this.g_state = this.s_normal;
                        else if (c == '\\') this.g_state = this.s_string_conv;
                        else if (c == 'EOF') this.g_state = this.s_eof;
                        break;
                    case this.s_string_conv:
                        this.put(c);
                        this.g_state = this.s_string;
                        break;
                    case this.s_linecomment:
                        if (c == '\\') this.g_state = this.s_linecomment_conv;
                        else if (c == '\n') this.g_state = this.s_normal, this.put(c);
                        else if (c == 'EOF') this.g_state = this.s_eof;
                        break;
                    case this.s_linecomment_conv:
                        if (c == '\\') ;
                        else if (c == 'EOF') this.g_state = this.s_eof;
                        else this.g_state = this.s_linecomment;
                        break;
                    case this.s_comment1:
                        if (c == '/') this.g_state = this.s_linecomment;
                        else if (c == '*') this.g_state = this.s_comment;
                        else if (c == 'EOF') this.g_state = this.s_eof;
                        else {
                            this.put('/');
                            while (this.g_convlinecnt) --this.g_convlinecnt, this.put("\\\n");
                            this.g_state = this.s_normal;
                            this.deal(c);
                        }
                        break;
                    case this.s_comment:
                        if (c == '*') this.g_state = this.s_commented1;
                        else if (c == 'EOF') this.g_state = this.s_eof;
                        break;
                    case this.s_commented1:
                        if (c == '/') this.g_state = this.s_normal, this.put(' ');
                        else if (c == 'EOF') this.g_state = this.s_eof;
                        else this.g_state = this.s_comment;
                        break;
                    case this.s_eof:
                        return -1;
                    default:
                        return -2;
                }
                return 0;
            }
    }
}

/*删除代码注释*/
module.exports.removeNote=function(text){
    var obj = format_obj();
    obj.init();
    //obj.g_trigraph_on = document.getElementById('format_trigraph').checked;
    var len = text.length;
    for (var c = 0; c < len; ++c) {
        obj.deal(text.substring(c, c+1));
    }
    obj.deal('EOF');
    return obj.g_output_string;
};
