<!DOCTYPE html>
<html lang="en">
	<head>
 		<meta charset="utf-8">
		<title>OTOG - One Tambon One Grader</title>

 <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>

	<style>
		 .bd-placeholder-img {
        font-size: 1.125rem;
        text-anchor: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      @media (min-width: 768px) {
        .bd-placeholder-img-lg {
          font-size: 3.5rem;
        }
      }	
	</style>

	<link href="login.css" rel="stylesheet">

	</head>

	<body>
		<form class="form-login" action="login_user.php" method="post">

			<h1 class="h4 mb-3 font-weight-hard text-center">One Tambon One Grader</h1><br>
			<label for="inputUsername" class="sr-only">Username</label>
			<input type="username" name="username" class="form-control" 
			placeholder="Username" required autofocus>
			<label for="inputPassword" class="sr-only">Password</label>
			<input type="password" name="password" class="form-control"
			placeholder="Password" required>

			<button class="btn custom-btn 
			btn-lg btn-block" type="submit">Sign in</button>
			<a class="btn custom-btn btn-lg btn-block" href="register.php">Register</a>
		</form>
	</body>

</html>