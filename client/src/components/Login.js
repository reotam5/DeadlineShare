import React, { useState } from "react";
import { FormControl, Input, InputAdornment, Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AccountCircle, Lock } from "@material-ui/icons";

function Login() {
  return (
    <div>
      <form action="/auth/login" method="post">
        <input name="say" id="say" value="Hi"/>
        <button>button</button>
      </form>
    </div>
  );
}

export default Login;
