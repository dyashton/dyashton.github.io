#include <iostream>
#include <math.h>
#include <vector>
#include <algorithm>
#include <unistd.h>
#include <termios.h>
#include <sys/select.h>
using namespace std;

struct Vect3{
	float a,b,c;
	Vect3(): a(0.0), b(0.0), c(0.0){}
	Vect3(float a, float b, float c): a(a), b(b), c(c){}
	void Print();
};

void Vect3::Print(){
	printf("\nx: %f, y: %f, z: %f",a,b,c);
}

struct Cube{
	float xPos, yPos;
	int cubeWidth;
	Vect3 angleSpds;
	bool active = false;
	float cubeYaw = 0.0, cubePitch = 0.0, cubeRoll = 0.0;
	void Project();
	Cube(){};
	Cube(float x, float y, int width): xPos(x), yPos(y), cubeWidth(width), angleSpds(Vect3(M_PI/32.0, M_PI/32.0, M_PI/32.0)){}
	
	Cube(float x, float y, int width, float yawSpeed, float pitchSpeed, float rollSpeed): xPos(x), yPos(y), cubeWidth(width), angleSpds(Vect3(yawSpeed,pitchSpeed,rollSpeed)){}
};


const string SENTINEL = " ";
const int SCREEN_WIDTH= 200;
const int SCREEN_HEIGHT = 100;

int distanceFromCamera = 40;
string screenBuffer[SCREEN_HEIGHT * SCREEN_WIDTH];		
float zBuffer[SCREEN_HEIGHT * SCREEN_WIDTH];



Vect3 Rotate(Vect3 coords, Vect3 angles){
	Vect3 result = coords;
	float i = coords.a, 
	      j = coords.b, 
	      k = coords.c,
	      yaw = angles.a,
	      pitch = angles.b,
	      roll = angles.c;
	result.a = i * cos(yaw) * cos(pitch) + 
		   j * cos(yaw) * sin(pitch) * sin(roll) - j * sin(yaw) * cos(roll) + 
		   k * cos(yaw) * sin(pitch) * cos(roll) + k * sin(yaw) * sin(roll);
	
	result.b = i * sin(yaw) * cos(pitch) +
		   j * sin(yaw) * sin(pitch) * sin(roll) + j * cos(yaw) * cos(roll) +
		   k * sin(yaw) * sin(pitch) * cos(roll) - k * cos(yaw) * sin(roll);
	
	result.c = i * (-1) * sin(pitch) + 
		   j * cos(pitch) * sin(roll) + 
		   k * cos(pitch) * cos(roll); 
	
	return result;
}

void calculateSurface(Vect3 Vec, Cube* cube, string str){
	Vect3 angles = Vect3(cube->cubeYaw, cube->cubePitch, cube->cubeRoll);
	Vec = Rotate(Vec, angles);
	Vec.c += distanceFromCamera;

	float ooz = 1/(Vec.c);
	int xp =(int)( (Vec.a * distanceFromCamera * ooz) + SCREEN_WIDTH/2 + cube->xPos);
	int yp =(int)( (Vec.b * distanceFromCamera * ooz) + SCREEN_HEIGHT/2 + cube->yPos);

	int index = xp + yp * SCREEN_WIDTH;

	if(index >= 0 && index < (SCREEN_HEIGHT*SCREEN_WIDTH) && ooz > zBuffer[index]){	
		screenBuffer[index] = str;
		zBuffer[index] = ooz;
	}


		
}

void Cube::Project(){
	for(float cubeX = -cubeWidth/2; cubeX < cubeWidth/2; cubeX +=0.1){
		for(float cubeY = -cubeWidth/2; cubeY < cubeWidth/2; cubeY += 0.1){
			if(!(this->active)){	
				calculateSurface(Vect3(-cubeX, cubeY, cubeWidth/2), this, "\033[31m@\033[0m");
				calculateSurface(Vect3(cubeX, cubeY, -cubeWidth/2), this, "\033[32m.\033[0m");
				calculateSurface(Vect3(cubeWidth/2, cubeY, cubeX),this, "\033[33m+\033[0m");
				calculateSurface(Vect3(-cubeWidth/2, cubeY, -cubeX), this, "\033[34m*\033[0m");
				calculateSurface(Vect3(cubeX, cubeWidth/2, cubeY), this, "\033[35m|\033[0m");
				calculateSurface(Vect3(cubeX, -cubeWidth/2, -cubeY), this, "\033[36m-\033[0m");
			}
			else{
			
				calculateSurface(Vect3(-cubeX, cubeY, cubeWidth/2), this, "@");
				calculateSurface(Vect3(cubeX, cubeY, -cubeWidth/2), this, ".");
				calculateSurface(Vect3(cubeWidth/2, cubeY, cubeX),this, "+");
				calculateSurface(Vect3(-cubeWidth/2, cubeY, -cubeX), this, "*");
				calculateSurface(Vect3(cubeX, cubeWidth/2, cubeY), this, "|");
				calculateSurface(Vect3(cubeX, -cubeWidth/2, -cubeY), this, "-");
			}
		}
	}
	this->cubeYaw += angleSpds.a;
	this->cubePitch += angleSpds.b;
	this->cubeRoll += angleSpds.c;
}
void display(){
	cout << "\x1b[2J";
	cout << "\x1b[H";
	for(int i = 0; i < SCREEN_HEIGHT; i++ ){
		for(int j = 0; j < SCREEN_WIDTH;j++){
			cout << screenBuffer[(i*SCREEN_WIDTH)+j];
		}
		cout << '\n';
	}
	

	fill_n(zBuffer, SCREEN_HEIGHT * SCREEN_WIDTH, 0);
	fill_n(screenBuffer, SCREEN_HEIGHT * SCREEN_WIDTH, SENTINEL);	
}

// Function to set the terminal to non-blocking mode
void setNonBlockingMode() {
    struct termios oldt, newt;
    tcgetattr(STDIN_FILENO, &oldt);  // Get the current terminal settings
    newt = oldt;
    newt.c_lflag &= ~(ICANON | ECHO);  // Disable canonical mode and echoing
    newt.c_cc[VMIN] = 1;  // Minimum number of characters to read (1 character)
    newt.c_cc[VTIME] = 0; // Timeout for reading characters (0 for no timeout)

    tcsetattr(STDIN_FILENO, TCSANOW, &newt);  // Apply the new terminal settings
}

// Function to restore terminal settings to the default state
void restoreTerminal() {
    struct termios oldt;
    tcgetattr(STDIN_FILENO, &oldt);
    oldt.c_lflag |= (ICANON | ECHO);  // Re-enable canonical mode and echoing
    tcsetattr(STDIN_FILENO, TCSANOW, &oldt);  // Apply the restored settings
}

// Function to get a single character without blocking (non-blocking mode)
char getch() {
    struct timeval tv = { 0, 0 };  // Timeout = 0 for non-blocking
    fd_set readfds;
    FD_ZERO(&readfds);
    FD_SET(STDIN_FILENO, &readfds);

    // Check if there is input available on stdin (non-blocking)
    if (select(1, &readfds, NULL, NULL, &tv) > 0) {
        char ch;
        if (read(STDIN_FILENO, &ch, 1) == 1) {
            return ch;
        }
    }
    return -1;  // No input available
}

int main(){
	bool pause = true;
	Cube activeCube;
	int activeIndex = 0;
	vector<Cube> Cubes(0);
	setNonBlockingMode();	

	fill_n(screenBuffer, SCREEN_HEIGHT * SCREEN_WIDTH, SENTINEL);	
	fill_n(zBuffer, SCREEN_HEIGHT * SCREEN_WIDTH, 0);
	
	Cubes.push_back(Cube(20.0,0.0, 25)); 		
	Cubes.push_back(Cube(-20.0, 0.0, 15, -M_PI/16, .1, M_PI/4));
	Cubes.push_back(Cube( 0.0, 30, 30, M_PI/48, -M_PI/32, .1));
	while(1){
		
		char ch = getch();  // Get a character without blocking
		if (ch != -1) {  // If input is available
		    //std::cout << "You pressed: " << ch << std::endl;
		    if (ch == 'q') {  // Exit if 'q' is pressed
			break;
		    }
		    else if(ch ==' '){
			pause = !pause;
		    }
		    else if(ch == 'w'){
			   if(activeIndex < Cubes.size()){
				if(activeIndex != 0){
					Cubes[activeIndex-1].active = !Cubes[activeIndex-1].active;
				}
				activeIndex++;
				Cubes[activeIndex-1].active = !Cubes[activeIndex-1].active;
				
			   }
			   else{
				Cubes[activeIndex-1].active = !Cubes[activeIndex-1].active;
				activeIndex = 0;
			   }

		    }
		    else if(ch == 27){
			    if(activeIndex != 0){
				    char nextChar = getch();
				    if (nextChar == '[') {
					    char direction = getch();
					    switch (direction) {
						case 'A':
						    std::cout << "Up arrow pressed" << std::endl;
						    Cubes[activeIndex-1].yPos -= 10;
						    break;
						case 'B':
						    std::cout << "Down arrow pressed" << std::endl;
						    Cubes[activeIndex-1].yPos += 10;
						    break;
						case 'C':
						    std::cout << "Right arrow pressed" << std::endl;
						    Cubes[activeIndex-1].xPos += 10;
						    break;
						case 'D':
						    std::cout << "Left arrow pressed" << std::endl;
						    Cubes[activeIndex-1].xPos -= 10;
						    break;
						default:
						    break;
					    }
				    }
			    }
		    }
		}

		if(!pause){
			for(Cube &c : Cubes){
				c.Project();
			}
			display();

		}
		usleep(4000 * 5);
	}

	restoreTerminal();

}

	


